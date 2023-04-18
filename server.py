import socket
import _thread
import sys
import re
import urllib.parse


def FileSort(direc, typ, data):
    if typ == 'r' or typ == 'rb':
        try:
            with open(direc, typ) as file:
                response = file.read()
                return response

        except FileNotFoundError:
            return '[]'
          
    elif typ == 'w':
        with open(direc, typ) as file:
            json.dump(data, file)

    elif typ == 'wb':
        with open(direc, typ) as file:
            file.write(data)

def do_request(connectionSocket):
    
    headersCombined = ""
    bodyCombined = ""
    body = ""

    while not "\r\n\r\n" in headersCombined:
        data = connectionSocket.recv(4096)
        headersCombined += data.decode('utf-8')

    headersCombined, partialBody = headersCombined.split('\r\n\r\n', 1)

    contentLengthMatch = re.search(r'Content-Length: (\d+)', headersCombined)
    
    if contentLengthMatch:
        contentLength = int(contentLengthMatch.group(1))
        bodyCombined += partialBody

        while len(bodyCombined) < contentLength:
            data = connectionSocket.recv(4096)
            bodyCombined += data.decode('utf-8')

        body = bodyCombined.split('&')

    headers = headersCombined.split('\r\n')

    try:
        requestPage = headers[0].split()[1]
    except IndexError:
        print('Request was terminated')
    
    responseData = ''
    
    match requestPage.split('/')[1]:
        case 'quiz':
            responseHeaders = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
            responseData = FileSort('Website/index.html','r','').encode()

        case 'Resources':
            responseHeaders = 'HTTP/1.1 200 OK\r\n'
            if(requestPage.split('/')[2] == 'functions.js'):
                responseHeaders+= 'Content-Type:application/javascript\r\n'
                responseData = FileSort('Website/Resources/functions.js','r','').encode()

            if(requestPage.split('/')[2] == 'style.css'):
                responseHeaders+= 'Content-Type:text/css\r\n'
                responseData = FileSort('Website/Resources/style.css','r','').encode()

        case 'Images':
            responseHeaders = 'HTTP/1.1 200 OK\r\nContent-Type:image/jpeg\r\n'
            file = urllib.parse.unquote(requestPage.split('/')[2])
            responseData = FileSort('Website/Images'+'/'+file,'rb','')
            responseHeaders += f"Cache-Control: public, max-age={86400}\r\n"

        case 'Fonts':
            responseHeaders = 'HTTP/1.1 200 OK\r\nContent-Type:application/x-font-ttf\r\n'
            file = urllib.parse.unquote(requestPage.split('/')[2])
            responseData = FileSort('Website/Fonts'+'/'+file,'rb','')
            responseHeaders += f"Cache-Control: public, max-age={86400}\r\n"
                

                
        case '':
            responseHeaders = 'HTTP/1.1 404 Not Found\r\n'
            responseData = ''.encode()
    
        case _:
            responseHeaders = 'HTTP/1.1 404 Not Found\r\n'
            responseData = ''.encode()

    fileSize = len(responseData)
    responseHeaders += f"Content-Length: {fileSize}\r\nConnection: close\r\n\r\n"


    connectionSocket.sendall(responseHeaders.encode() + responseData)
    connectionSocket.close()


def main(serverPort):
    mySocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    mySocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    mySocket.bind(('',serverPort))
    mySocket.listen()
    print('The server is ready to receive messages on port:', serverPort)

    while True:
        connectionSocket, addr = mySocket.accept()
        _thread.start_new_thread(do_request, (connectionSocket,))

        
if __name__ == '__main__':
    if len(sys.argv) > 1:
        serverPort = int(sys.argv[1])
    else:
        serverPort = 1337
        
    main(serverPort)
