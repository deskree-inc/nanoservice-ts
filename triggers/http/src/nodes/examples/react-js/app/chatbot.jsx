// public/app.js
const { useState, useEffect } = React;

function ChatBot() {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const ctx = JSON.parse(atob(ctx_base64));

	useEffect(() => {
		setMessages((prevMessages) => [
			...prevMessages,
			{ text: "Hello! Let share a fact about cats. Ok?", sender: "bot", id: Math.floor(Math.random() * 100) },
		]);
		setMessages((prevMessages) => [
			...prevMessages,
			{ text: ctx.response.data.fact, sender: "bot", id: Math.floor(Math.random() * 100) },
		]);
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (input.trim()) {
			setMessages([...messages, { text: input, sender: "user", id: Math.floor(Math.random() * 100) }]);
			setInput("");

			// Simulate bot response
			setTimeout(() => {
				setMessages((prevMessages) => [
					...prevMessages,
					{ text: `You said: ${input}`, sender: "bot", id: Math.floor(Math.random() * 100) },
				]);
			}, 500);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-md w-96 overflow-hidden">
			<h1 className="bg-blue-500 text-white text-center py-4 text-xl font-bold">
				Simple {ctx.request.params.workflow}
			</h1>
			<div className="h-96 overflow-y-auto p-4 space-y-4">
				{messages.map((message, index) => (
					<div
						key={message.id}
						className={`p-2 rounded-lg ${
							message.sender === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-gray-800"
						} max-w-[80%] ${message.sender === "user" ? "text-right" : "text-left"}`}
					>
						{message.text}
					</div>
				))}
			</div>
			<form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
				<div className="flex">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Type your message..."
						className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						type="submit"
						className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						Send
					</button>
				</div>
			</form>
		</div>
	);
}

ReactDOM.render(<ChatBot />, document.getElementById("root"));
