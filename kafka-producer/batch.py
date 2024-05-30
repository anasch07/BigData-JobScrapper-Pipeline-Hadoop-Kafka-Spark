from confluent_kafka import Producer
import socket
import time
import utils
from load_env import get_env_var

conf = {'bootstrap.servers': f'{get_env_var("KAFKA_BOOTSTRAP_SERVER_HOST" , "localhost")}{get_env_var('KAFKA_BOOTSTRAP_SERVER_PORT' , "9092")}',
        'client.id': socket.gethostname()}

producer = Producer(conf)

def acked(err, msg):
    if err is not None:
        print("Failed to deliver message: %s: %s" % (str(msg), str(err)))
    else:
        print("Message produced: %s" % (str(msg)))


batch = []

for chunk in utils.read_in_chunks('./data/linkedin_job_posts.txt',  int(get_env_var('CHUNK_SIZE' , 10))):

    for line in chunk:

            print(line, end="")

            if len(batch) <= int(get_env_var('BATCH_SIZE' , 1000)):
                    batch.append(line)
            else:
                time.sleep(int(get_env_var('BATCH_SLEEP' , 60)))
                batch_to_send = '\n'.join(batch)
                producer.produce(get_env_var("BATCH_TOPIC" , "batch"), key="key", value=batch_to_send, callback=acked)
                batch = []




# Wait up to 1 second for events. Callbacks will be invoked during
# this method call if the message is acknowledged.
producer.poll(1)