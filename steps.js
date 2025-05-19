const hadoopSteps = [
  `Step 1: Install Java
sudo apt update && sudo apt install openjdk-8-jdk`,

  `Step 2: Check Java installation
java -version`,

  `Step 3: Add Hadoop user:
sudo apt install ssh
sudo adduser hadoop`,

  `Step 4: Grant sudo access to hduser
sudo usermod -aG sudo hadoop`,

  `Step 5: Set up SSH for hduser
su - hadoop
ssh-keygen -t rsa
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys  
chmod 640 ~/.ssh/authorized_keys
ssh localhost`,

  `Step 6: Download Hadoop binary
  su - hadoop
wget https://dlcdn.apache.org/hadoop/common/hadoop-3.3.6/hadoop-3.3.6.tar.gz
tar -xvzf hadoop-3.3.6.tar.gz
mv hadoop-3.3.6 hadoop`,

  `Step 7: Set Hadoop environment variables
Edit ~/.bashrc and add:
nano ~/.bashrc

export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export HADOOP_HOME=/home/hadoop/hadoop
export HADOOP_INSTALL=$HADOOP_HOME
export HADOOP_MAPRED_HOME=$HADOOP_HOME
export HADOOP_COMMON_HOME=$HADOOP_HOME
export HADOOP_HDFS_HOME=$HADOOP_HOME
export HADOOP_YARN_HOME=$HADOOP_HOME
export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native
export PATH=$PATH:$HADOOP_HOME/sbin:$HADOOP_HOME/bin
export HADOOP_OPTS="-Djava.library.path=$HADOOP_HOME/lib/native"

Then run:
source ~/.bashrc`,

  `Step 8: Configure Hadoop core-site.xml
Edit $HADOOP_HOME/etc/hadoop/core-site.xml and add:

nano $HADOOP_HOME/etc/hadoop/hadoop-env.sh
activate JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64

cd hadoop/
mkdir -p ~/hadoopdata/hdfs/{namenode,datanode}

nano $HADOOP_HOME/etc/hadoop/core-site.xml 
<configuration>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://localhost:9000</value>
    </property>
</configuration>`,

  `Step 9: Configure hdfs-site.xml
Edit $HADOOP_HOME/etc/hadoop/hdfs-site.xml and add:
nano $HADOOP_HOME/etc/hadoop/hdfs-site.xml 
<configuration>
    <property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>

    <property>
        <name>dfs.namenode.name.dir</name>
        <value>file:///home/hadoop/hadoopdata/hdfs/namenode</value>
    </property>

    <property>
        <name>dfs.datanode.data.dir</name>
        <value>file:///home/hadoop/hadoopdata/hdfs/datanode</value>
    </property>
</configuration>`,

  `Step 10: Format NameNode
  nano $HADOOP_HOME/etc/hadoop/mapred-site.xml
  <configuration>
    <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
    </property>
    <property>
        <name>mapreduce.admin.user.env</name>
        <value>HADOOP_MAPRED_HOME=$HADOOP_COMMON_HOME</value>
    </property>
    <property>
        <name>yarn.app.mapreduce.am.env</name>
        <value>HADOOP_MAPRED_HOME=$HADOOP_COMMON_HOME</value>
    </property>
</configuration>
`,

  `Step 11: Start Hadoop services
  
nano $HADOOP_HOME/etc/hadoop/yarn-site.xml
<configuration>
    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
</configuration>

hdfs namenode -format

start-all.sh jps`,

  `Step 12: Check HDFS
jps
Access web UI at:
http://localhost:9870/`
];

module.exports = { hadoopSteps };