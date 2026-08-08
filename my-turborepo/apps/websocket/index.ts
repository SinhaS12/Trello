import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });



let ISSUE: { id: number, title: string, section: string }[] = [{
    id: Math.random(),
    title: "fix the flexbox",
    section: "todo"
}, {
    id: Math.random(),
    title: "to be done by tommorow",
    section: "done"
}]



const connections: any[] = [];

wss.on("connection", (socket) => {
    connections.push(socket);
    socket.send(JSON.stringify({
        type: "initial_state",
        issue: ISSUE
    }))
    socket.on("message", (data) => {
        const parseData = JSON.parse(data.toString());
        if (parseData.section == "issue_added") {
            const new_issue = {
                title: parseData.title,
                id: Math.random(),
                section: parseData.section
            }
            ISSUE.push(new_issue);
            connections.forEach(s => s.send(JSON.stringify({
                type: "issue_added",
                issue: new_issue
            })));

        }
        if (parseData.section == "delete_issue") {
            ISSUE = ISSUE.filter(s => s.id != parseData.issueId)
            connections.forEach(s => s.send(JSON.stringify({
                type: "delete_issue",
                issue: parseData.issueId
            })))
        }
    })
})