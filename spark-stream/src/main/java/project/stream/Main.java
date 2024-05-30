package project.stream;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import org.apache.spark.api.java.function.FlatMapFunction;
import org.apache.spark.sql.*;
import org.apache.spark.sql.streaming.StreamingQuery;
import org.apache.spark.sql.streaming.Trigger;
import org.apache.spark.sql.types.DataTypes;
import org.apache.spark.sql.types.StructType;
import org.bson.Document;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Objects;
import java.util.Properties;

import static org.apache.spark.sql.expressions.Window.orderBy;
import static org.apache.spark.sql.functions.*;

public class Main {
    public static void main(String[] args) throws Exception {
        // Load properties
        Properties properties = new Properties();
        try (FileInputStream fis = new FileInputStream("config.properties")) {
            properties.load(fis);
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }

        String bootstrapServers = properties.getProperty("bootstrapServers");
        String topics = properties.getProperty("topics");
        String groupId = properties.getProperty("groupId");
        String mongoUri = properties.getProperty("mongoUri");
        String mongoDatabase = properties.getProperty("mongoDatabase");
        String mongoCollection = properties.getProperty("mongoCollection");

        StructType schema = new StructType()
                .add("title", DataTypes.StringType, true)
                .add("type", DataTypes.StringType, true)
                .add("company", DataTypes.StringType, true)
                .add("minSalary", DataTypes.FloatType, true)
                .add("maxSalary", DataTypes.FloatType, true);

        SparkSession spark = SparkSession
                .builder()
                .appName("jobs offers salaries stream")
                .getOrCreate();

        // Create DataFrame representing the stream of input lines from Kafka
        Dataset<Row> df = spark
                .readStream()
                .format("kafka")
                .option("kafka.bootstrap.servers", bootstrapServers)
                .option("subscribe", topics)
                .option("kafka.group.id", groupId)
                .load();

        Dataset<Row> processedData = df.selectExpr("CAST(value AS STRING)") // Select only the value column and cast to STRING
                .as(Encoders.STRING()) // Encode as STRING
                .flatMap((FlatMapFunction<String, String>) value -> {
                    String[] messages = value.split("/EOL");
                    return Arrays.asList(messages).iterator();
                }, Encoders.STRING())
                .flatMap((FlatMapFunction<String, Row>) line -> {
                    String[] elements = line.split("\t");
                    if (elements.length >= 13) {
                        String title = elements[2];
                        String type = elements[1];
                        String company = elements[13].split(",")[0];
                        try {
                            company = company.split(":")[1];
                        } catch (Exception e) {
                            company = company.split(":")[0];
                        }
                        company = company.substring(1, company.length() - 1);
                        float minSalary, maxSalary;
                        try {
                            minSalary = Float.parseFloat(elements[9]);
                        } catch (Exception e) {
                            minSalary = 99;
                        }
                        try {
                            maxSalary = Float.parseFloat(elements[10]);
                        } catch (Exception e) {
                            maxSalary = 0;
                        }
                        return Arrays.asList(RowFactory.create(title, type, company, minSalary, maxSalary)).iterator();
                    } else {
                        // Optional: Log or handle lines with insufficient elements
                        System.err.println("Line '" + line + "' has less than 13 elements, skipping.");
                        throw new Exception("dataset format error");
                    }
                }, Encoders.row(schema));

        Dataset<Row> data_agg = processedData.withColumn("minSalary", coalesce(col("minSalary"), lit(99.99)))
                .withColumn("maxSalary", coalesce(col("maxSalary"), lit(0.0)))
                .withColumn("eventTime", current_timestamp())
                .withWatermark("eventTime", "10 seconds")
                .groupBy(window(col("eventTime"), "10 seconds"))
                .agg(
                        max(col("maxSalary")).alias("maxSalary"),
                        min(col("minSalary")).alias("minSalary"),
                        count(col("title")).alias("totalJobs"),
                        approx_count_distinct(col("company")).alias("totalCompanies"),
                        current_timestamp().alias("date"),
                        first_value(col("type")).alias("type")
                );

        StreamingQuery query = data_agg
                .writeStream()
                .outputMode("complete")
                .foreachBatch((batchDF, batchId) -> {
                    batchDF.write()
                            .format("mongo")
                            .option("uri", mongoUri)
                            .option("database", mongoDatabase)
                            .option("collection", mongoCollection)
                            .mode("append")
                            .save();
                })
                .trigger(Trigger.ProcessingTime("10 seconds"))
                .start();

        query.awaitTermination();
    }
}
