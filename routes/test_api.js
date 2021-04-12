const express = require('express');
const router = express.Router();
const neo4j_calls = require('./../neo4j_calls/neo4j_api');

router.get('/', async function (req, res, next) {
    res.status(200).send("Root Response from :8080/test_api")
    return 700000;
})

router.get('/neo4j_get', async function (req, res, next) {
    let result = await neo4j_calls.get_num_nodes();
    console.log("RESULT IS", result)
    res.status(200).send({ result })    //Can't send just a Number; encapsulate with {} or convert to String.     
    return { result };
})

router.get('/connections/:digimon_name', async (req,res,next) => {
    let data = await neo4j_calls.get_link_nodes(req.params.digimon_name);
    // res.status(200).send(data)
    // return data;
    
    let result = formatRelationships(data)
    
    res.status(200).send(result)
    console.log(result)
    return  result ;
    
})

const formatRelationships = (relationships, nodes = new Set(), links = {}) => {
    relationships.records.forEach( record => {
        record._fields[0].segments.forEach( segment => {
            nodes.add(segment.start.properties.name)
            nodes.add(segment.end.properties.name)
            const key = `${segment.start.properties.name},${segment.end.properties.name}`
            if(key in links) links[key] += 1;
            else links[key] = 1;
        })
    })


    let nodeArray = [];
    nodes.forEach( node => {
        nodeArray.push({name: node})
    })
    console.log(nodeArray);

    let linkArray = [];
    // links.forEach( link => {
    //     let [source, target] = link.split(",");
    //     linkArray.push({
    //         source: source, 
    //         target: target, 
    //         value: 1
    //     })
    // })
    for(const [key,value] of Object.entries(links)){
        const [source, target] = key.split(",");
        linkArray.push({
            source: source, 
            target: target, 
            value: value
        })
    }
    console.log(linkArray);

    return {nodes: nodeArray, links: linkArray}
}

router.post('/neo4j_post', async function (req, res, next) {
    //Passing in "name" parameter in body of POST request
    let { name } = req.body;
    let string = await neo4j_calls.create_user(name);
    res.status(200).send("User named " + string + " created")
    return 700000;
    //res.status(200).send("test delete")
})

module.exports = router;