let neo4j = require('neo4j-driver');
let { creds } = require("./../config/credentials");
let driver = neo4j.driver("bolt://0.0.0.0:7687", neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw));


exports.get_link_nodes = async (name) => {
    let session = driver.session(); 
    const link_nodes = await session.run(`MATCH r = (dd:Digimon)-[:DIGIVOLVE*0..6]->(b:Digimon{name: "${name}"})-[:DIGIVOLVE*0..6]->(d:Digimon) return r`)
    session.close(); 
    console.log(link_nodes);
    return link_nodes
}


exports.get_num_nodes = async function () {
    let session = driver.session();
    const num_nodes = await session.run('MATCH (n) RETURN n', {
    });
    session.close();
    console.log("RESULT", (!num_nodes ? 0 : num_nodes.records.length));
    return (!num_nodes ? 0 : num_nodes.records.length);
};
exports.create_user = async function (name) {
    let session = driver.session();
    let user = "No User Was Created";
    try {
        user = await session.run('MERGE (n:user {name: $id}) RETURN n', {
            id: name
        });
    }
    catch (err) {
        console.error(err);
        return user;
    }
    return user.records[0].get(0).properties.name;
}