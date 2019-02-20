const { test } = require('tap')
const getTree = require('..')
const fs = require('fs')

test('getTree(dir)', async t => {
  t.ok(await getTree(`${__dirname}/..`))
})

test('getTree.fromPackageJSON', async t => {
  t.ok(getTree.fromPackageLock({
    packageJSON: require('../package'),
    packageLock: require('../package-lock')
  }))
})

test('getTree.fromNodeModules', async t => {
  const tree = await getTree.fromNodeModules(`${__dirname}/..`)
  t.ok(tree.children.length > 0, 'found dependencies')
})

test('getTree.fromYarnLock', async t => {
  t.ok(getTree.fromYarnLock({
    yarnLock: fs.readFileSync(`${__dirname}/yarn.lock`, 'utf8'),
    packageJSON: require('../package')
  }))
})

test('getTree.fromNSolid', async t => {
  t.ok(getTree.fromNSolid(require('./nsolid')))
})

test('getTree.flatten', async t => {
  const nodeA = {
    data: {
      name: 'a',
      version: '0'
    },
    children: [
      {
        data: {
          name: 'b',
          version: '0'
        },
        children: []
      }
    ]
  }
  t.deepEqual(getTree.flatten({
    children: [nodeA]
  }), [
    {
      name: 'a',
      version: '0',
      paths: [[]]
    },
    {
      name: 'b',
      version: '0',
      paths: [[nodeA]]
    }
  ])
})
