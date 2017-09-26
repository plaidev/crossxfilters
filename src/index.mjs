import crossfilter from 'crossfilter'

const FILTER_METHODS = [
  'filter',
  'filterAll',
  'filterExact',
  'filterRange',
  'filterFunction'
]

export class Manager {
  constructor() {
    this._cf = {}
    this._commonDimensions = {}
    this._dimensions = {
      default: {}
    }
  }

  // interfaces

  registerDataset(data, options={}) {
    const {
      dataset = 'default'
    } = options
    this._cf[dataset] = crossfilter(data)
    return this._cf[dataset]
  }

  registerDimension(name, method, options={}) {
    const {
      dataset = 'default',
      common = false
    } = options

    const cf = this.dataset(dataset)

    if (!cf) {
      return null
    }

    let dim = this.dimension(name, options)

    if (dim) return dim

    if (common) {
      dim = this.buildCommonDimension(name, cf, method)
      if (!this._commonDimensions[name]) this._commonDimensions[name] = {}
      this._commonDimensions[name][dataset] = dim
    }
    else {
      dim = cf.dimension(method)
      if (!this._dimensions[dataset]) this._dimensions[dataset] = {}
      this._dimensions[dataset][name] = dim
    }

    return dim
  }

  dataset(dataset='default') {
    return this._cf[dataset]
  }

  dimension(name, options={}) {
    const {
      dataset = 'default',
      common = false
    } = options

    if (common) {
      if (this._commonDimensions[name]) {
        return this._commonDimensions[name][dataset]
      }
    }
    else {
      if (this._dimensions[dataset]) {
        return this._dimensions[dataset][name]
      }
    }
    return null
  }

  filterAll() {
    // dimension.filterAll() by each dimensions
    Object.values(this._dimensions).forEach((ds) => {
      Object.values(ds).forEach((dim) => {
        dim.filterAll()
      })
    })

    if (!Object.keys(this._commonDimensions).length) return;

    Object.values(this._commonDimensions).forEach((ds) => {
      Object.values(ds).forEach((dim) => {
        dim._filterAll()
      })
    })
  }

  // inner methods

  filterCommonDimensions(name, method, ...args) {
    if (!this._commonDimensions[name]) return;
    Object.keys(this._commonDimensions[name]).forEach((k) => {
      const dim = this._commonDimensions[name][k]
      const _method = `_${method}`
      dim[_method](...args)
    })
    return null
  }

  buildCommonDimension(name, cf, method) {
    const dim = cf.dimension(method)
    const self = this
    const proxy = new Proxy(dim, {
      get (ins, prop) {
        if (prop[0] === '_' && FILTER_METHODS.includes(prop.slice(1))) {
          const _prop = prop.slice(1)
          return (...args) => ins[_prop](...args)
        }
        if (FILTER_METHODS.includes(prop)) {
          return (...args) => self.filterCommonDimensions(name, prop, ...args)
        }
        if (ins[prop] instanceof Function || typeof ins[prop] === 'function') {
          return (...args) => ins[prop](...args)
        }
        return ins[prop]
      }
    })

    return proxy
  }
}

