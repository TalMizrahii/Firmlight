import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import time
import re
import urllib.robotparser as robotparser


class CrawlerTask:
    def __init__(self, start_url, link_limit):
        self.start_url = start_url
        self.link_limit = link_limit
        self.visited_links = set()
        self.to_visit_links = [start_url]
        self.crawled_links = []
        self.delay = 1  # Delay between requests in seconds

    def can_crawl(self, url):
        try:
            # Check if crawling is allowed via robots.txt
            rp = robotparser.RobotFileParser()
            rp.set_url(urljoin(url, '/robots.txt'))
            rp.read()
            return rp.can_fetch("*", url)
        except Exception as e:
            print(f"Error checking robots.txt for {url}: {e}")
            return False

    def get_links(self, url):
        links = set()
        try:
            response = requests.get(url, timeout=5)
            response.raise_for_status()  # Check for HTTP errors
            soup = BeautifulSoup(response.text, 'html.parser')
            for a_tag in soup.find_all('a', href=True):
                full_url = urljoin(url, a_tag['href'])
                # Ignore non-http links and fragments
                if re.match(r'^https?://', full_url):
                    links.add(full_url)
        except requests.RequestException as e:
            print(f"Error crawling {url}: {e}")
        return links

    def crawl(self):
        while self.to_visit_links and len(self.crawled_links) < self.link_limit:
            current_url = self.to_visit_links.pop(0)
            if current_url not in self.visited_links and self.can_crawl(current_url):
                print(f"Crawling: {current_url}")
                self.visited_links.add(current_url)
                self.crawled_links.append(current_url)
                links = self.get_links(current_url)
                self.to_visit_links.extend(links - self.visited_links)
                time.sleep(self.delay)  # Respect the server by waiting
            else:
                print(f"Skipping: {current_url} (visited or disallowed)")

        return self.crawled_links
