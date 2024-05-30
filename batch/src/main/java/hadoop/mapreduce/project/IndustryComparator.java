package hadoop.mapreduce.project;

import org.apache.hadoop.io.WritableComparable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.io.WritableComparator;

/// I used this class to compare the industry by alphabet asc
public class IndustryComparator extends WritableComparator {

    protected IndustryComparator() {
        super(Text.class, true);
    }

    @Override
    public int compare(WritableComparable a, WritableComparable b) {
        Text industry1 = (Text) a;
        Text industry2 = (Text) b;
        System.out.println(a);
        int industryComparison = industry2.compareTo(industry1);

        return industry1.compareTo(industry2);
    }
}