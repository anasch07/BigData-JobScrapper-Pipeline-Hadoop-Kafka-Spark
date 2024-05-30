package hadoop.mapreduce.project;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.UpdateOptions;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;
import java.io.IOException;
import org.bson.Document;


public class CompanyReducer extends Reducer<Text, IntWritable, Text, IntWritable> {
    private MongoClient mongoClient;
    private MongoCollection<Document> collection;

    @Override
    protected void setup(Context context) throws IOException, InterruptedException {
        super.setup(context);
        try {
            mongoClient = MongoClients.create("");
            MongoDatabase database = mongoClient.getDatabase("batch");
            collection = database.getCollection("company_count");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void reduce(Text key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException {
        int sum = 0;
        for (IntWritable val : values) {
            sum += val.get();
        }

        Document query = new Document("industry", key.toString());
        Document update = new Document("$inc", new Document("count", sum)); // Increment count by 'sum'

        collection.updateOne(query, update, new UpdateOptions().upsert(true));
    }

    @Override
    protected void cleanup(Context context) throws IOException, InterruptedException {
        super.cleanup(context);
        mongoClient.close();
    }
}
