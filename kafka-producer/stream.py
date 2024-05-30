from confluent_kafka import Producer
import socket
import time
import utils
from load_env import get_env_var

conf = {'bootstrap.servers': f'{get_env_var("KAFKA_BOOTSTRAP_SERVER_HOST" , "localhost")}:{get_env_var('KAFKA_BOOTSTRAP_SERVER_HOST' , 9092)}',
        'client.id': socket.gethostname()}

producer = Producer(conf)

def acked(err, msg):
    if err is not None:
        print("Failed to deliver message: %s: %s" % (str(msg), str(err)))
    else:
        print("Message produced: %s" % (str(msg)))


stream = []

for chunk in utils.read_in_chunks('./data/linkedin_job_posts.txt', int(get_env_var('CHUNK_SIZE' , 10))):

    for line in chunk:

            print(line, end="")
            if len(stream) <= int(get_env_var('STREAM_SIZE' , 10)):
                stream.append(line)
            else:
                time.sleep(int(get_env_var('STREAM_SLEEP' , 5)))
                stream_to_send = '\n'.join(stream)
                producer.produce(get_env_var("STREAM_TOPIC" , "stream"), key="key", value=stream_to_send, callback=acked)
                stream = []




# Wait up to 1 second for events. Callbacks will be invoked during
# this method call if the message is acknowledged.
producer.poll(1)