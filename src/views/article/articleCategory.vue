<template>
  <div>
    <Row>
      <Col span="24">
      <Card>
        <p slot="title">
          <Icon type="android-contact"></Icon>
          文章分类
        </p>
        <div slot="extra">
          <Button size="small" type="ghost" @click="categoryList">新增</Button>
          <Button size="small" type="ghost" @click="categoryList">刷新</Button>
        </div>
        <div>
          <Table :columns="categoryColumns" :data="categoryData"></Table>
        </div>
      </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      categoryColumns: [
        {
          title: '名称',
          key: 'name',
          render: (h, params) => {
            const row = params.row
            return (<div class="tree-list">
              <span class={'level' + row.level}>
                <icon type="arrow-down-b"></icon>
                <icon class="category-icon" type="ios-list-outline"></icon>
              </span>
              <span>
                {row.name}
              </span>
            </div>)
          }
        },
        {
          title: '描述',
          key: 'description',
        },
        {
          title: '标识id',
          key: '_id',
        },
        {
          title: '操作',
          key: 'age',
          width: 130,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.$router.push({
                      path: '/crawler/category',
                      query: {
                        site_id: params.row._id,
                        site_name: params.row.name
                      }
                    })

                  }
                }
              }, '分类'),
              h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                on: {
                  click: () => {

                  }
                }
              }, '编辑')
            ]);
          }
        },

      ],
      categoryData: []

    };
  },
  methods: {
    async categoryList() {
      const params = {
        url: 'category/list',
        payload: {}
      }
      const result = await this.post(params)
      this.categoryData = this.initData(result.data, 1, null)
      console.log('看看你的魅力值')
      console.log(this.categoryData)
    },
    initData(items, level, parent) {
      let initItems = [];
      items.forEach((item, index) => {
        item = Object.assign({}, item, {
          'parent': parent,
          'level': level,
        });
        if ((typeof item.expanded) === 'undefined') {
          item = Object.assign({}, item, {
            'expanded': false
          });
        }
        if ((typeof item.show) === 'undefined') {
          item = Object.assign({}, item, {
            'isShow': false
          });
        }
        if ((typeof item.isChecked) === 'undefined') {
          item = Object.assign({}, item, {
            'isChecked': false
          });
        }
        item = Object.assign({}, item, {
          'load': (!!item.expanded)
        });
        initItems.push(item);
        if (item.children) {
          const insertIndex = initItems.findIndex(x => x._id === item._id);
          if (insertIndex > -1) {
            const childItems = this.initData(item.children, level + 1, item._id)
            initItems.splice(insertIndex, 0, ...childItems)
          }
        }
      });
      return initItems
    }
  },
  mounted() {
    this.categoryList()

  }


};
</script>

<style lang="less">
.tree-list {
  display: flex;
  .category-icon {
    margin-left: 6px;
    margin-right: 2px;
  }
  .level1 {
    width: 30px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .level2 {
    width: 45px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>



