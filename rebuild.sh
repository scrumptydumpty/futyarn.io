if [ "$1" == "client" ]; then
	echo "Rebuilding client files and restarting container..!"
    docker stop futyarn && docker rm futyarn && docker build -t futyarn . && docker run --name futyarn --network br0 -d futyarn 
elif [ "$1" == "nocontainer" ]; then
    echo "Starting new container.."
    docker build -t futyarn . && docker run --name futyarn --network br0 -d futyarn
else
	echo "Restarting container..!"
    docker stop futyarn && docker rm futyarn && docker build -t futyarn . && docker run --name futyarn --network br0 -d futyarn
fi