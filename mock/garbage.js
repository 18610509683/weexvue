/*
 * @Description: 垃圾信息管理模拟数据
 */
import Mock from 'mockjs'

const List = []
const count = 100

const img_url = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'


for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: i,
    'cname|1': ['塑料', "瓶罐", "塑料衣架","使用油瓶","可乐瓶","剪刀","订书机","废旧衣服"
                ,'充电电池', "纽扣电池", "一次性电池","废水银温度计","废旧日光灯","蛋壳","鱼骨头","剩菜剩饭"
                ,'苹果皮', "花生壳", "动物内脏","过期食品","西瓜皮","咖啡渣","动物骨头","中药渣"
              ],
    'category_id|1': ['1', '2', '3', '4'],
    img_url,
    sorts: 50
  }))
}

//---------------------垃圾分类数据模拟
const categoryList = [
  {id: 1, cname: '厨余垃圾', description: '厨余垃圾'},
  {id: 2, cname: '可回收物', description: '可回收物'},
  {id: 3, cname: '有害垃圾', description: '有害垃圾'},
  {id: 4, cname: '回收垃圾', description: '回收垃圾'}
]

export default [
  {
    url: '/garbage/list',
    type: 'get',
    response: config => {
      const { category_id, name, page = 1, limit = 20, sort  } = config.query

      let mockList = List.filter(item => {
        if (category_id && item.category_id !== category_id) return false
        if (name && item.name.indexOf(name) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/garbage/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },
  {
    url: '/garbage/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/garbage/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  //--------------------分类数据相关
  {
    url: '/garbage/categorylist',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20  } = config.query

      let mockList = categoryList.filter(item => {
        return true
      })

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/garbage/createCategory',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/garbage/updateCategory',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

]

