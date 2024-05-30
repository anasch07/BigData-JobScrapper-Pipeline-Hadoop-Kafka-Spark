package hadoop.mapreduce.project;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.mapreduce.Partitioner;

/// I used this class to make all the same industry go to the same reducer
public class IndustryPartitioner extends Partitioner<Text, IntWritable> {

    @Override
    public int getPartition(Text key, IntWritable value, int numPartitions) {
        return Math.abs(key.hashCode() % numPartitions);
    }
}
