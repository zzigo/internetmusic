#technologies 

 wget is a command line utility for downloading files from the internet. It supports downloading files via HTTP, HTTPS, and FTP protocols, and can be used to recursively download entire websites. It is commonly used in scripting and automation tasks to fetch files from remote servers.

 1. Download a single webpage:
```
wget https://example.com/page.html
```

2. Download an entire website:
```
wget --recursive --no-clobber --page-requisites --html-extension --convert-links --restrict-file-names=windows --domains example.com https://example.com
```

3. Limit the download speed:
```
wget --limit-rate=100k https://example.com/page.html
```

4. Download only specific file types:
```
wget -r -A pdf,docx https://example.com
```

5. Ignore robots.txt file and crawl the website:
```
wget -e robots=off -r https://example.com
```

