// Membuat pemetaan di ElasticSearch
// Pemetaan seperti mendefinisikan struktur untuk dokumen,
// untuk menentukan bagaimana dokumen akan disimpan dan diindeks.

const esClient = require('./client')
const addmappingToIndex = async function (indexName, mappingType, mapping) {
  console.log(mapping)
  return await esClient.indices.putMapping({
    index: indexName,
    type: mappingType,
    body: mapping
  })
}

async function migrate() {
  const mapping = {
    properties: {
      title: {
        type: 'text'
      },
      tags: {
        type: 'keyword'
      },
      body: {
        type: 'text'
      },
      timestamp: {
        type: 'date',
        format: 'epoch_millis'
      }
    }
  }
  try {
    const resp = await addmappingToIndex('blog', 'posts', mapping)
    console.log(resp)
  } catch (e) {
    console.log(e)
  }
}

migrate()
