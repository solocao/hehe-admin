<template>
  <div class="crawler-category">
    <Row>
      <Col span="24">
      <Card>
        <p slot="title">
          <Icon type="android-contact"></Icon>
          中国企业网 爬虫分类
        </p>
        <div slot="extra">
          <Button size="small" type="ghost" @click="categoryAdd">新增</Button>
          <Button size="small" type="ghost" @click="categoryList">刷新</Button>
        </div>
        <div>
          <Table :columns="categoryColumns" :data="categoryData"></Table>
        </div>
      </Card>
      </Col>
    </Row>
    <Modal v-model="categoryModal" :title="categoryMode==='add'?'新增分类':'更新分类'" @on-ok="ok" @on-cancel="cancel">
      <Form :model="form" label-position="left" :label-width="100">
        <FormItem label="网站分类">
          <Input v-model="form.origin_category"></Input>
        </FormItem>
        <FormItem label="网站地址">
          <Input v-model="form.url"></Input>
        </FormItem>
        <FormItem label="系统内分类">
          <Dropdown placement="bottom-start">
            <a href="javascript:void(0)">
              {{categoryName}}
              <Icon type="arrow-down-b"></Icon>
            </a>
            <DropdownMenu slot="list" style="width:300px;padding-left:10px">
              <Tree :data="categoryTreeData"></Tree>
            </DropdownMenu>
          </Dropdown>

        </FormItem>
        <FormItem label="爬列表规则">
          <Input v-model="form.list_rule"></Input>
        </FormItem>
        <FormItem label="爬详情规则">
          <Input v-model="form.detail_rule"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      categoryTreeData: [],
      categoryModal: false,
      categoryMode: null,
      categoryName: '暂无分类',
      form: {
        // 站点id
        site_id: null,
        // 站点分类名称
        origin_category: null,
        // 此站点的网址
        url: null,
        // 本系统目标分类
        target_category: null,
        list_rule: null,
        detail_rule: null
      },
      categoryColumns: [
        {
          title: '原站分类',
          key: 'origin_category',
          render: (h, params) => {
            const row = params.row
            return (<a target="_blank" href={row.url}>{row.origin_category}</a>)
          }
        },
        {
          title: '分类ID',
          key: '_id'
        },
        {
          title: '系统分类',
          key: 'target_category',
          render: (h, params) => {
            const row = params.row
            let name = '';
            if (row.target_category) {
              name = row.target_category.name
            }
            return (<span>{name}</span>)
          }
        },
        {
          title: '日期',
          key: 'create_at'
        },

        {
          title: '规则列表',
          key: 'asdf',
          render: (h, params) => {
            const { list_rule, detail_rule } = params.row
            return h('div', [
              h('div', list_rule),
              h('div', detail_rule)
            ]);
          }

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
                    // this.show(params.index)
                  }
                }
              }, '详情'),
              h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.categoryUpdate(params.row)
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
    cancel() { },
    treeChange(data) {
      console.log(data)
      const { name, _id } = data;
      this.categoryName = name;
      this.form.target_category = _id;
    },
    categoryAdd() {
      this.categoryModal = true;
      this.categoryMode = 'add';
      // 站点分类名称
      this.form.origin_category = null;
      // 此站点的网址
      this.form.url = null;
      // 本系统目标分类
      this.form.target_category = null;
      this.form.list_rule = null;
      this.form.detail_rule = null;
    },
    // 获取分类列表树
    async categoryTreeList() {
      const params = {
        url: 'category/list',
        payload: {}
      }
      const result = await this.post(params)
      const data = result.data
      const self = this
      function nodeTree(tree) {
        tree.forEach(e => {
          e.title = e.name;
          e.expand = true;
          e.render = (h, { root, node, data }) => {
            return (<span class="tree-span" onClick={() => { self.treeChange(data) }}>{e.name}</span>)
          }
          if (e.children === undefined) {
            return
          } else {
            nodeTree(e.children)
          }
        });
      }
      nodeTree(data)
      this.categoryTreeData = data
    },
    categoryUpdate(row) {
      const { origin_category, origin_id, target_category, _id, crule, list_rule, detail_rule, url } = row
      console.log(row)
      if (target_category) {
        this.categoryName = target_category.name;
        this.form.target_category = target_category._id;
      } else {
        this.categoryName = '暂无分类';
        this.form.target_category = null;
      }
      this.form.url = url;
      this.form.category_id = _id;
      this.form.origin_category = origin_category;
      this.form.list_rule = list_rule;
      this.form.detail_rule = detail_rule;
      this.categoryModal = true;
      this.categoryMode = 'update';
    },
    async ok() {
      if (this.categoryMode === 'add') {
        const formCopy = JSON.parse(JSON.stringify(this.form));
        Object.keys(formCopy).map(x => {
          if (formCopy[x] === null)
            delete formCopy[x]
        })
        delete formCopy.category_id
        console.log(formCopy)
        const params = {
          url: 'crawler/site/category/add',
          payload: formCopy,
          auth: true
        }
        const result = await this.post(params)
        this.categoryList()
      }
      if (this.categoryMode === 'update') {
        const formCopy = JSON.parse(JSON.stringify(this.form))
        Object.keys(formCopy).map(x => {
          if (formCopy[x] === null)
            delete formCopy[x]
        })
        const params = {
          url: '/crawler/site/category/update',
          payload: formCopy
        }
        const result = await this.post(params)
        this.categoryList()
      }
    },
    async categoryList() {
      const site_id = this.$route.query.site_id
      const params = {
        url: 'crawler/site/category/list',
        payload: {
          site_id: site_id
        }
      }
      const result = await this.post(params)
      this.$Message.info('分类获取成功')
      this.categoryData = result.data
      console.log(result)

    }
  },
  mounted() {
    this.form.site_id = this.$route.query.site_id
    this.categoryList()
    this.categoryTreeList()
  }
};
</script>
<style lang="stylus" scoped>
.ivu-tree ul li {
  margin: -4px 0 !important;
}

.tree-span {
  width: 100%;
  cursor: pointer;
  padding: 6px;
  border-radius: 2px;

  &:hover {
    background: #EAF4FE;
  }
}

.ivu-dropdown-rel {
  a {
    color: #495060 !important;
  }
}
</style>


