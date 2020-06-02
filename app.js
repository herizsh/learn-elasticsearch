const express = require('express')
const esClient = require('./client')
const app = express()
const port = 3000

// melakukan test apakah elasticsearch sedang berjalan atau tidak
app.get('/ping', (req, res, next) => {
  esClient.ping(
    {
      // ping usually has a 3000ms timeout
      requestTimeout: 1000
    },
    function (error) {
      if (error) {
        next('elasticsearch cluster is down!')
      } else {
        res.send('All is well')
      }
    }
  )
})

// Mengindeks Data ke dalam Elasticsearch
// Pengindeksan Data pada dasarnya berarti memasukkan data ke dalam Elasticsearch.
app.post('insertdocument', (req, res, next) => {
  // const data = {
  //   title: 'Learn elastic search',
  //   tags: ['NodeJS', 'Programming'],
  //   body: `Lot of content here...`
  // }
  esClient
    .index({
      index: indexName,
      type: mappingType,
      // bisa tanpa id, nanti auto generate
      // id: _id,
      body: req.body
    })
    .then((resp) => {
      res.send(resp)
    })
    .catch(next)
})

// melakukan update pada suatu dokumen
app.post('update', (req, res, next) => {
  const { indexName, mappingType, id, documentBody } = req.body
  esClient
    .index({
      index: indexName,
      type: mappingType,
      id: id,
      body: documentBody
    })
    .then((resp) => {
      res.send(resp)
    })
    .catch(next)
})

// Melakukan pencarian sederhana di Elasticsearch
app.post('/search', (req, res, next) => {
  const { indexName, mappingType, payload } = req.body
  // Contoh pencarian dibawah ini akan menghasilkan item yang judulnya bertuliskan ‘Learn‘.
  // const body = {
  //   query: {
  //     match: {
  //       title: 'Learn'
  //     }
  //   }
  // }
  esClient
    .search({
      index: indexName,
      type: mappingType,
      body: payload
    })
    .then((resp) => {
      res.send(resp)
    })
    .catch(next)
})

// Pencarian saat kita mengetik ElasticSearch
// Pencarian elastis memiliki berbagai variasi pencarian,
// pada contoh sebelumnya pencarian akan cocok dengan seluruh kata yang dilewatkan dalam kueri,
//  sehingga artikel yang memiliki kata 'Learn' dalam judul akan ditampilkan.
// Tetapi jika Anda mencoba mengubahnya menjadi `L` atau‘ Lear ’,
// itu tidak akan memberi hasil apa pun.

// Untuk mengatasi jenis kueri ini kita bisa menggunakan match_phrase_prefix.
// Ini membantu dalam mengembalikan hasil pencarian saat Anda mengetik pencarian Anda.
// Contoh yang sering kita temui adalah seperti saat kita mencari sesuatu di google.

app.post('/searchasyoutype', (req, res, next) => {
  const { indexName, mappingType, payload } = req.body
  // const body = {
  //   query: {
  //     match_phrase_prefix: {
  //       title: 'Lea'
  //     }
  //   }
  // }
  esClient
    .search({
      index: indexName,
      type: mappingType,
      body: payload
    })
    .then((resp) => {
      res.send(resp)
    })
    .catch(next)
})

// Agregasi dalam Elasticsearch
// Ini adalah salah satu jenis pencarian terpenting yang tersedia di Elasticsearch.

// Jika Anda pernah menggunakan amazon untuk membeli sesuatu
// biasanya ketika kita melakukan pencarian akan muncul seperti berikut:
// "Keyboard di Aksesoris Komputer", "pisau di Peralatan Dapur"
// contoh lainnya adalah, muncul kategori beserta jumlahnya seperti Windows (10), Ubuntu (4).
app.post('/searchwithaggregation', (req, res, next) => {
  const { indexName, mappingType, payload } = req.body
  // const body = {
  //   query: {
  //     match_phrase_prefix: {
  //       title: 'Learn'
  //     }
  //   },
  //   aggs: {
  //     tags: {
  //       terms: {
  //         field: 'tags'
  //       }
  //     }
  //   }
  // }

  esClient
    .search({
      index: indexName,
      type: mappingType,
      body: payload
    })
    .then((resp) => {
      res.send(resp)
    })
    .catch(next)
})

// menghapus document dari index
app.post('/delete', (req, res, next) => {
  const { indexName, mappingType, id } = req.body
  esClient
    .delete({
      index: indexName,
      type: mappingType,
      id: id
    })
    .then((resp) => {
      res.send(resp)
    })
    .catch(next)
})

app.use((err, req, res, next) => {
  res.send(err)
})

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
)
