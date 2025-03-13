create-env:
	python3 python3 -m venv python3_runtime
open-env:
	source $(path)/python3_runtime/bin/activate
install:
	pip3 install -r requirements.txt
test:
	python3 -m unittest
requirements:
	pip3 freeze > requirements.txt
generate-proto:
	python -m grpc_tools.protoc -I. --python_out=./gen/. --grpc_python_out=./gen/. --proto_path=../proto node.proto