
import { BinaryHeap } from './heap.js';

onload = function () {
    // create a network
    let curr_data;
    const container = document.getElementById('mynetwork');
    const container2 = document.getElementById('mynetwork2');
    const genNew = document.getElementById('generate-graph');
    const solve = document.getElementById('solve');
    const temptext = document.getElementById('temptext');
    
    // initialise graph options
    const options = {
        edges: {
            arrows: {
                to: true
            },
            labelHighlightBold: true,
            font: {
                size: 20
            }
        },
        nodes: {
            font: '12px arial red',
            scaling: {
                label: true
            },
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf183',
                size: 50,
                color: '#991133',
            }
        }
    };
    // initialize your network!
    let network = new vis.Network(container);
    network.setOptions(options);
    let network2 = new vis.Network(container2);
    network2.setOptions(options);

    function createData(){
        const sz = Math.floor(Math.random() * 8) + 2;

        // Adding people to nodes array
        let nodes = [];
        for(let i=1;i<=sz;i++){
            nodes.push({id:i, label:"Person "+i})
        }
        nodes = new vis.DataSet(nodes);  //converting the generated value to tha format of vis.js

        // Dynamically creating edges with random amount to be paid from one to another friend
        const edges = [];
        for(let i=1;i<=sz;i++){
            for(let j=i+1;j<=sz;j++){
                // Modifies the amount of edges added in the graph
                if(Math.random() > 0.5){
                    // Controls the direction of cash flow on edge
                    if(Math.random() > 0.5)
                        edges.push({from: i, to: j, label: String(Math.floor(Math.random()*100)+1)});
                    else
                        edges.push({from: j, to: i, label: String(Math.floor(Math.random()*100)+1)});
                }
            }
        }
        const data = {
            nodes: nodes,
            edges: edges
        };
        return data;
    }

    genNew.onclick = function () {   //This function is executed when the "Get New Problem" button is clicked.
        const data = createData();   //The createData function is called to generate a new random graph. This graph consists of nodes (people) and edges (cash flows).
        curr_data = data;
        network.setData(data);
        temptext.style.display = "inline";
        container2.style.display = "none";
    };

    solve.onclick = function () {    //This function is executed when the "Solve" button is clicked.
        temptext.style.display  = "none";
        container2.style.display = "inline";
        const solvedData = solveData();     //The solveData function is called to process the current graph 
                                            //(curr_data) and generate a solved version of it. This function calculates the net balance for each person and adjusts the edges accordingly to settle the debts optimally.
        network2.setData(solvedData);       //The solved data is set to the network2 object, which is another instance of vis.Network. 
    };

    function solveData() {

        //The solveData function is designed to optimize financial transactions among a group of people, reducing the number of transactions needed to settle all debts. 

        let data = curr_data;
        const sz = data['nodes'].length;   // The number of people (nodes).
        const vals = Array(sz).fill(0);     // An array initialized with zeros to store the net balance of each person.
        
        // Calculating net balance of each person
        for(let i=0;i<data['edges'].length;i++) {
            const edge = data['edges'][i];
            vals[edge['to'] - 1] += parseInt(edge['label']);
            vals[edge['from'] - 1] -= parseInt(edge['label']);
        }

        const pos_heap = new BinaryHeap();
        const neg_heap = new BinaryHeap();

        for(let i=0;i<sz;i++){
            if(vals[i]>0){
                pos_heap.insert([vals[i],i]);
            } else{
                neg_heap.insert(([-vals[i],i]));
                vals[i] *= -1;
            }
        }

        const new_edges = [];
        while(!pos_heap.empty() && !neg_heap.empty()){
            const mx = pos_heap.extractMax();
            const mn = neg_heap.extractMax();

            const amt = Math.min(mx[0],mn[0]);
            const to = mx[1];
            const from = mn[1];

            new_edges.push({from: from+1, to: to+1, label: String(Math.abs(amt))});
            vals[to] -= amt;
            vals[from] -= amt;

            if(mx[0] > mn[0]){
                pos_heap.insert([vals[to],to]);
            } else if(mx[0] < mn[0]){
                neg_heap.insert([vals[from],from]);
            }
        }

        data = {
            nodes: data['nodes'],
            edges: new_edges
        };
        return data;
    }

    genNew.click();

};