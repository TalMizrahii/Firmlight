import socketio
import asyncio
import aiohttp
import json
import random
import threading
from queue import Queue
import src.CrawlerTask.crawlerTask as crawlerTask

sio = socketio.AsyncClient()
task_queue = Queue()

SERVER_SOCKET_URL = "https://firmlight.onrender.com"
LOGIN_HTTP_URL = "https://firmlight.onrender.com/auth/login"
WEBSOCKET_URL = "wss://firmlight.onrender.com"


def get_user_credentials():
    username = input("Enter your username or email: ")
    password = input("Enter your password: ")
    return {
        "usernameOrEmail": username,
        "password": password
    }


def get_thread_count():
    while True:
        try:
            count = int(input("Enter the number of worker threads (1-5): "))
            if 1 <= count <= 5:
                return count
            else:
                print("Please enter a number between 1 and 5.")
        except ValueError:
            print("Invalid input. Please enter a number.")


async def login(data):
    async with aiohttp.ClientSession() as session:
        async with session.post(LOGIN_HTTP_URL, json=data) as response:
            if response.status == 200:
                return await response.json()
            else:
                return None


@sio.event
async def connect():
    print("Connected to the server")


@sio.event
async def disconnect():
    print("Disconnected from the server")


@sio.on('meanTaskComplete')
async def handle_mean_task_complete(data):
    task_id = data['taskId']
    result = data['result']
    mean = perform_mean_task(result)
    print(f"\033[92mTask {task_id} final result: mean = {mean}\033[0m")


@sio.on('taskCompleted')
async def handle_task_completed(data):
    task_id = data['taskId']
    result = data['result']
    print(f"\033[92mTask {task_id} final result: {result}\033[0m")


@sio.on('newTask')
async def handle_new_task(data):
    print(f"New task received: {data}", " of type ", type(data))
    task_queue.put(data)
    print(f"New task added to queue. Queue size: {task_queue.qsize()}")


def worker():
    while True:
        data = task_queue.get()
        asyncio.run(process_task(data))
        task_queue.task_done()


async def process_task(data):
    task_id = data['fullTaskData']['id']
    task_type = data['fullTaskData']['type']
    task_title = data['fullTaskData']['title']
    task_chunk = data['taskChunk']

    print(f"Processing task: {task_title} (ID: {task_id}, Type: {task_type})")
    result = await perform_task(task_type, task_id, task_chunk, data['fullTaskData'])

    print(f"Task {task_id} completed with result: {result}")
    await sio.emit('taskResult', {'taskId': task_id, 'result': result})


async def perform_task(task_type, task_id, task_chunk, full_task_data):
    print(f"Processing task {task_id} of type {task_type}")
    if task_type == "MEAN":
        return perform_mean_task(task_chunk)
    elif task_type == "CRAWLER":
        urls = task_chunk.get('urls', [])
        crawl_limit = task_chunk.get('crawlLimit', random.randint(1, 5))
        return perform_crawler_task(urls, crawl_limit)
    elif task_type == "FACTORIZATION":
        return perform_factorization_task(task_chunk, full_task_data)
    else:
        print(f"Unknown task type: {task_type}")
        return None


def perform_crawler_task(urls, crawl_limit):
    all_crawled_results = []
    for url in urls:
        print(f"Starting crawl for URL: {url}")
        crawler = crawlerTask.CrawlerTask(url, crawl_limit)
        result = crawler.crawl()
        print(f"Crawled links from {url}: {result}")
        all_crawled_results.append({
            "url": url,
            "results": result
        })
    return all_crawled_results


def perform_factorization_task(task_chunk, full_task_data):
    start = task_chunk['start']
    end = task_chunk['end']
    number = full_task_data['data']['numberToFactor']
    factors = [i for i in range(start, end + 1) if number % i == 0]
    return factors


def perform_mean_task(task_chunk):
    numbers = task_chunk
    mean = sum(numbers) / len(numbers)
    print(f"Calculated mean for chunk: {mean}")
    return mean


async def main():
    auth_login_data = get_user_credentials()

    try:
        payload = await login(auth_login_data)
    except Exception as e:
        print(f"Failed to login: {e}")
        return
    if not payload:
        print("Login failed. Please check your credentials.")
        return

    try:
        await sio.connect(WEBSOCKET_URL, headers={"authorization": f"Bearer {payload['accessToken']}"})
        print("Connected successfully")

        # Get the number of worker threads from the user
        num_worker_threads = get_thread_count()
        print(f"Starting {num_worker_threads} worker threads.")

        # Start worker threads
        for _ in range(num_worker_threads):
            threading.Thread(target=worker, daemon=True).start()

        await sio.wait()
    except Exception as e:
        print(f"Failed to connect: {e}")


if __name__ == "__main__":
    asyncio.run(main())
