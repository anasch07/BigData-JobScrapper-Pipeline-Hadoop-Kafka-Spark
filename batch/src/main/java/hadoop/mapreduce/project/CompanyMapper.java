package hadoop.mapreduce.project;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;
import java.util.StringTokenizer;

public class CompanyMapper extends Mapper<Object, Text, Text, IntWritable> {
    private Text industry = new Text();
    private final static IntWritable one  = new IntWritable(1);

    public void map(Object key, Text value, Mapper.Context context) throws IOException, InterruptedException {
        StringTokenizer itr = new StringTokenizer(value.toString(), "\t");

        for (int i = 0; i < 5; i++) {
            if (itr.hasMoreTokens()) {
                itr.nextToken();
            } else {
                return;
            }
        }

        if (itr.hasMoreTokens()) {
            String industriesString = itr.nextToken();
            String[] industriesArray = industriesString.split(", ");
            for (String industry : industriesArray) {
                this.industry.set(industry);
                context.write(this.industry, one);
            }
        }
    }
}

