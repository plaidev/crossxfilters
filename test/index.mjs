import chai from 'chai'
const {assert} = chai

import {Manager} from '../dist/'
import crossfilter from 'crossfilter'


describe('Dataset', function() {

  before(function() {
    this.manager = new Manager()
  })

  it('無名(default)データセットを登録できる', async function() {
    const data = []
    this.manager.registerDataset(data)

    const cf = this.manager.dataset() // default
    assert(cf.dimension instanceof Function)
  })

  it('名前をつけてデータセットを登録できる', async function() {
    const name = '2nd'
    const data = []
    this.manager.registerDataset(data, {dataset: name})

    const cf = this.manager.dataset(name)
    assert(cf.dimension instanceof Function)
  })

  it('filterAllが実行できる', async function() {
    this.manager.filterAll()
  })

})

describe('Dimension', function() {

  beforeEach(function() {
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

    it('dimensionを作成できる', async function() {
      const name = 'dim1'
      const dim = this.manager.registerDimension(name, (d) => d.key)
      assert(!!dim)
    })

    it('名前が同じdimensionをregisterすると同じdimensionインスタンスが返る', async function() {
      const name = 'dim1'
      const dim1 = this.manager.registerDimension(name, (d) => d.key)
      const dim2 = this.manager.registerDimension(name, (d) => d.key)
      assert(dim1 === dim2)
    })

    it('dimensionにフィルタを掛けることができる', async function() {
      const name = 'dim1'
      const dim = this.manager.registerDimension(name, (d) => d.key)
      const cf = this.manager.dataset()

      assert(cf.groupAll().reduceSum((d) => d.val).value() === 3)

      dim.filter('a')

      assert(cf.groupAll().reduceSum((d) => d.val).value() === 1)
    })

  })

  describe('commonタイプ', function() {

    it('commonDimensionを作成できる', async function() {
      const name = 'dim'
      const dim = this.manager.registerDimension(name, (d) => d.key, {common: true})
      assert(!!dim)
    })

    it('名前が同じdimensionをregisterすると同じdimensionインスタンスが返る', async function() {
      const name = 'dim'
      const dim1 = this.manager.registerDimension(name, (d) => d.key, {common: true})
      const dim2 = this.manager.registerDimension(name, (d) => d.key, {common: true})
      assert(dim1 === dim2)
    })

    it('名前が同じでもcommonの条件で別なdimensionインスタンスが返る', async function() {
      const name = 'dim'
      const dim1 = this.manager.registerDimension(name, (d) => d.key, {common: true})
      const dim2 = this.manager.registerDimension(name, (d) => d.key, {common: false})
      assert(dim1 !== dim2)
    })

    it('commonDimensionにフィルタを掛けることができる', async function() {
      const name = 'dim'
      const dim = this.manager.registerDimension(name, (d) => d.key, {common: true})
      const cf = this.manager.dataset()

      const result1 = cf.groupAll().reduceSum((d) => d.val).value()
      assert(result1 === 3)

      dim.filter('a')

      const result2 = cf.groupAll().reduceSum((d) => d.val).value()
      assert(result2 === 1)
    })

    it('別のdatasetでもcommonDimensionはfilterが共通化される', async function() {
      const name = 'commonDim'
      const dim1 = this.manager.registerDimension(name, (d) => d.key, {common: true})
      const dim2 = this.manager.registerDimension(name, (d) => d.key, {dataset: this.otherDataset, common: true})
      const cf = this.manager.dataset()
      const cfOther = this.manager.dataset(this.otherDataset)

      assert(dim1 !== dim2)

      const result1 = cf.groupAll().reduceSum((d) => d.val).value()
      const result2 = cfOther.groupAll().reduceSum((d) => d.num).value()

      assert(result1 === 3)
      assert(result2 === 7)

      dim1.filter('a')

      // dim1, dim2に影響している
      const result3 = cf.groupAll().reduceSum((d) => d.val).value()
      const result4 = cfOther.groupAll().reduceSum((d) => d.num).value()

      assert(result3 === 1)
      assert(result4 === 3)
    })

    it('commonでなく名前が共通の場合、影響しない', async function() {
      const name = 'commonDim'
      const dim1 = this.manager.registerDimension(name, (d) => d.key, {common: true})
      const dim2 = this.manager.registerDimension(name, (d) => d.key, {dataset: this.otherDataset, common: false})
      const cf = this.manager.dataset()
      const cfOther = this.manager.dataset(this.otherDataset)

      assert(dim1 !== dim2)

      const result1 = cf.groupAll().reduceSum((d) => d.val).value()
      const result2 = cfOther.groupAll().reduceSum((d) => d.num).value()
      assert(result1 === 3)
      assert(result2 === 7)

      dim1.filter('a')

      // dim1, dim2に影響しない
      const result3 = cf.groupAll().reduceSum((d) => d.val).value()
      const result4 = cfOther.groupAll().reduceSum((d) => d.num).value()
      assert(result3 === 1)
      assert(result4 === 7)
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

