const code = `
javac -classpath $(hadoop classpath) *.java
jar cvf als.jar *.class

hadoop jar als.jar ALSDriver X.txt output 2


hadoop fs -cat output/part-r-00000 | grep "^U," > U.txt
hadoop fs -cat output/part-r-00000 | grep "^V," > V.txt
`