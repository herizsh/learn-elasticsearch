// Membuat Indeks di Elasticsearch
// Indeks dalam Elasticsearch dianalogikan dengan basis data di mesin penyimpanan lain
// (misalnya: MongoDB).

const esClient = require('./client')
const createIndex = async function (indexName) {
  return await esClient.indices.create({
    index: indexName
  })
}

async function migrate() {
  try {
    const resp = await createIndex('blog')
    console.log(resp)
  } catch (e) {
    console.log(e)
  }
}
migrate()
