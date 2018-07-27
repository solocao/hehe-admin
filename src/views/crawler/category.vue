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
          <Input v-model="form.target_category"></Input>
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
      categoryModal: false,
      categoryMode: null,
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
          title: '分类',
          key: 'origin_category'
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
                    this.show(params.index)
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
    categoryAdd() {
      this.categoryModal = true;
      this.categoryMode = 'add';
    },
    categoryUpdate(row) {
      const { origin_category, origin_id, target_category, _id, crule, list_rule, detail_rule, url } = row
      this.form.url = url;
      this.form.category_id = _id;
      this.form.origin_category = origin_category;
      this.form.target_category = target_category;
      this.form.list_rule = list_rule;
      this.form.detail_rule = detail_rule;
      this.categoryModal = true;
      this.categoryMode = 'update';
    },
    async ok() {
      if (this.categoryMode === 'add') {
        const formCopy = this.form;
        Object.keys(formCopy).map(x => {
          if (formCopy[x] === null)
            delete formCopy[x]
        })
        const params = {
          url: 'crawler/site/category/add',
          payload: formCopy,
          auth: true
        }
        const result = await this.post(params)
        alert(result)
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

  }

};
</script>
<style lang="stylus">
</style>


