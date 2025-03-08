import datetime
from time import sleep

import pendulum
from airflow.decorators import dag, task


@dag(
    dag_id="test-dag",
    schedule_interval="0 0 * * *",
    start_date=pendulum.datetime(2021, 1, 1, tz="UTC"),
    catchup=False,
    dagrun_timeout=datetime.timedelta(minutes=60),
)
def test_dag():
    @task
    def func1():
        print('Hello 1')

    @task
    def func2():
        sleep(5)

    @task
    def func3():
        print('Bye bye')

    return func1() >> func2() >> func3()

dag = test_dag()
