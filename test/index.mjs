import chai from 'chai'
const {assert} = chai

import {Manager} from '../dist/'
import crossfilter from 'crossfilter'


describe('Dataset', function() {

  before(function() {
    this.manager = new Manager()
  })

  it.skip('無名(default)データセットを登録できる', async function() {
    const data = []
    this.manager.registerDataset(data)

    const cf = this.manager.dataset() // default

    assert(cf instanceof crossfilter)
  })

  it.skip('名前をつけてデータセットを登録できる', async function() {
    const name = '2nd'
    const data = []
    this.manager.registerDataset(data, {dataset: name})

    const crossfilter = this.manager.dataset(name)

    assert(crossfilter instanceof crossfilter)
  })

  it.skip('filterAllが実行できる', async function() {
    this.manager.filterAll()
  })

})

describe('Dimension', function() {

  before(function() {
    this.manager = new Manager()
    const name = 'other'
    const data = {
      'default': [
        {key: 'a', val: 1},
        {key: 'b', val: 2},
      ],
      [name]: [
        {key: 'a', num: 3},
        {key: 'b', num: 4},
      ]
    }
    this.manager.registerDataset(data['default']) 
    this.manager.registerDataset(data[name], {dataset: name})

    this.otherDataset = name
  })

  describe('通常タイプ', function() {

    it.skip('dimensionを作成できる', async function() {
      const name = 'dim1'
      const dim = this.manager.registerDimension(name, (d) => d.key)
      assert(!!dim)
    })

    it.skip('名前が同じdimensionをregisterすると同じdimensionインスタンスが返る', async function() {
      const name = 'dim1'
      const dim1 = this.manager.registerDimension(name, (d) => d.key)
      const dim2 = this.manager.registerDimension(name, (d) => d.key)
      assert(dim1 === dim2)
    })

    it.skip('dimensionにフィルタを掛けることができる', async function() {
      const name = 'dim1'
      const dim = this.manager.registerDimension(name, (d) => d.key)

      const results1 = dim.group().reduceSum((d) => d.val).all()
      assert(results1[0] === 3)

      dim.filter('a')

      const results2 = dim.group().reduceSum((d) => d.val).all()
      assert(results2[0] === 1)
    })

  })

  describe('commonタイプ', function() {

    before(function() {
      this.manager = new Manager()
    })

    afterEach(function() {
      this.manager.filterAll()
    })

    it.skip('commonDimensionを作成できる', async function() {
      const name = 'dim'
      const dim = this.manager.registerDimension(name, (d) => d.key, {common: true})
      assert(!!dim)
    })

    it.skip('名前が同じdimensionをregisterすると同じdimensionインスタンスが返る', async function() {
      const name = 'dim'
      const dim1 = this.manager.registerDimension(name, (d) => d.key, {common: true})
      const dim2 = this.manager.registerDimension(name, (d) => d.key, {common: true})
      assert(dim1 === dim2)
    })

    it.skip('名前が同じでもcommonの条件で別なdimensionインスタンスが返る', async function() {
      const name = 'dim'
      const dim1 = this.manager.registerDimension(name, (d) => d.key, {common: true})
      const dim2 = this.manager.registerDimension(name, (d) => d.key, {common: false})
      assert(dim1 !== dim2)
    })

    it.skip('commonDimensionにフィルタを掛けることができる', async function() {
      const name = 'dim'
      const dim = this.manager.registerDimension(name, (d) => d.key, {common: true})

      const results1 = dim.group().reduceSum((d) => d.val).all()
      assert(results1[0] === 3)

      dim.filter('a')

      const results2 = dim.group().reduceSum((d) => d.val).all()
      assert(results2[0] === 1)
    })

    it.skip('別のdatasetでもcommonDimensionはfilterが共通化される', async function() {
      const name = 'commonDim'
      const dim1 = this.manager.registerDimension(name, (d) => d.key, {common: true})
      const dim2 = this.manager.registerDimension(name, (d) => d.key, {dataset: this.otherDataset, common: true})

      assert(dim1 !== dim2)

      const results1 = dim1.group().reduceSum((d) => d.val).all()
      const results2 = dim2.group().reduceSum((d) => d.num).all()
      assert(results1[0] === 3)
      assert(results2[0] === 7)

      dim1.filter('a')

      // dim1, dim2に影響している
      const results3 = dim1.group().reduceSum((d) => d.val).all()
      const results4 = dim2.group().reduceSum((d) => d.num).all()
      assert(results3[0] === 1)
      assert(results4[0] === 3)
    })

    it.skip('commonでなく名前が共通の場合、影響しない', async function() {
      const name = 'commonDim'
      const dim1 = this.manager.registerDimension(name, (d) => d.key, {common: true})
      const dim2 = this.manager.registerDimension(name, (d) => d.key, {dataset: this.otherDataset, common: false})

      assert(dim1 !== dim2)

      const results1 = dim1.group().reduceSum((d) => d.val).all()
      const results2 = dim2.group().reduceSum((d) => d.num).all()
      assert(results1[0] === 3)
      assert(results2[0] === 7)

      dim1.filter('a')

      // dim1, dim2に影響しない
      const results3 = dim1.group().reduceSum((d) => d.val).all()
      const results4 = dim2.group().reduceSum((d) => d.num).all()
      assert(results3[0] === 1)
      assert(results4[0] === 7)
    })

  })

  describe('各種フィルタ', function() {

    // it.skip('filter', async function() {
    // })

    it.skip('filterExact', async function() {
    })

    it.skip('filterRange', async function() {
    })

    it.skip('filterAll', async function() {
    })

    it.skip('filterFunction', async function() {
    })

    it.skip('dimension.topが正常に動く', async function() {
    })

    it.skip('dimension.bottomが正常に動く', async function() {
    })

  })

})

