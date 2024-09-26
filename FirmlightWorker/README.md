

<h1 align="center">
  <br>
  <a href="https://firmlight.onrender.com/"><img src="https://github.com/TalMizrahii/firmlight-py-client/blob/main/Assets/FullLogo.png" alt="HTML" width="300"></a>
  <br>
  <br>
<h2 align="center">
  Firmlight Python Worker
  </h2>
  <br>
</h1>

<h4 align="center">
A Python-based distributed task worker for the Firmlight distributed system, which processes tasks such as data crawling, mean calculations, and number factorization using WSS WebSockets and HTTPS-based communication. 
  <p align="center">
  <a href="#description">Description</a> •
  <a href="#implementation">Implementation</a> •
  <a href="#dependencies">Dependencies</a> •
  <a href="#installing-and-executing">Installing And Executing</a> •
  <a href="#authors">Authors</a> 
</p>

## Description
Firmlight Python Worker is a key component of the Firmlight distributed system, designed to receive and process various tasks from a central server using WebSockets. These tasks include:

* Mean Calculation: Processes a set of numbers and calculates their mean.
* Web Crawler: Scrapes URLs for links up to a specified crawl limit.
* Number Factorization: Factors a given number over a specified range.

The worker receives task data, processes it according to the task type, and sends the results back to the server. This system is built to handle tasks efficiently across multiple worker threads, providing scalability for distributed computation.


## Implementation

This worker client is implemented using Python's asyncio, aiohttp, and socketio libraries for asynchronous processing. The system connects to the Firmlight API and processes tasks using the following workflow:

* Login – The client sends HTTPS requests to authenticate via the Firmlight API.
* WebSocket Secure Connection – After authentication, a WebSocket connection is established to listen for new tasks in real time using WSS protocol.
* Task Handling – The worker listens for various task types (e.g., MEAN, CRAWLER, FACTORIZATION), processes them asynchronously, and returns the result to the server.
* 
### Key Functions

* login() – Authenticates the user with their credentials via an HTTPS POST request.
* process_task() – Handles task processing based on the task type, which can include mean calculation, web crawling, or number factorization.
* perform_crawler_task() – Implements a web crawler to fetch links from URLs.
* perform_factorization_task() – Implements number factorization for a given range.
* perform_mean_task() – Calculates the mean of a list of numbers.


The worker can be scaled by specifying the number of threads that process tasks concurrently, improving its ability to handle a large number of tasks efficiently.


## Dependencies

The Python worker requires the following dependencies:

- **aiohttp**: For making asynchronous HTTPS requests to login and communicate with the backend server.
- **python-socketio**: For connecting to the WebSocket server and handling real-time task distribution.
- **asyncio**: To handle asynchronous task processing, especially useful in non-blocking operations.
- **maskpass**: Used for secure password input in the terminal.
- **requests**: For making HTTPS requests in the crawler, used to retrieve HTML content from URLs.
- **beautifulsoup4**: For parsing HTML content to extract links from web pages in the crawler.
- **urllib3**: Handles URL parsing and connection management in the crawler.
- **urllib.robotparser**: For managing crawling permissions via `robots.txt`.

## Installing And Executing

To clone and run this application, you'll need [Git](https://git-scm.com) installed on your computer. From your command line:

```bash
# Clone this repository.
$ git clone https://github.com/TalMizrahii/Firmlight

# Go into the repository.
$ cd Firmlight/FirmlightWorker

# Install the required dependencies.
$ pip install -r requirements.txt

# Run the worker.
$ python worker.py

```

## Authors
* [@Tal Mizrahi](https://github.com/TalMizrahii)


