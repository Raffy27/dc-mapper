const fs = require('fs/promises'),
    data = require('./graph_3.json');

async function main(){
    console.log('Converting dataset');
    let nodes = [], edges = [];
    for(const node of data.nodes){
        nodes.push({
            id: node.v,
            shape: node.value.root ? 'box' : 'circularImage',
            image: `https://cdn.discordapp.com/icons/${node.v}/${node.value.icon}?size=64`,
            label: node.value.name
        });
    }
    for(const edge of data.edges){
        edges.push({
            from: edge.v,
            to: edge.w
        });
    }
    console.log('Rendering');
    let temp = (await fs.readFile('./index.html')).toString();
    temp = temp.replace('[/* nodes here */]', JSON.stringify(nodes));
    temp = temp.replace('[/* edges here */]', JSON.stringify(edges));
    await fs.writeFile('./render.html', temp);
    console.log('Done');
}

main();