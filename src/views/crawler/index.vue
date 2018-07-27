<template>
  <div>
    <Row>
      <Col span="24">
      <Card>
        <p slot="title">
          <Icon type="android-contact"></Icon>
          爬取网站列表
        </p>
        <div slot="extra">
          <Button size="small" type="ghost" @click="siteModeAdd">新增</Button>
          <Button size="small" type="ghost" @click="siteList">刷新</Button>
        </div>

        <div>
          <Table :columns="siteColumns" :data="siteData"></Table>
        </div>
      </Card>
      </Col>
    </Row>
    <Modal v-model="siteModal" :title="siteMode==='add'?'新增站点':'更新站点'" @on-ok="ok" @on-cancel="cancel">
      <Form :model="form" label-position="left" :label-width="100">
        <FormItem label="网站名称">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="网站地址">
          <Input v-model="form.site"></Input>
        </FormItem>
        <FormItem label="网站描述">
          <Input v-model="form.description"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 网站编辑的模态框
      siteModal: false,
      // 模态框当前的状态
      siteMode: false,
      form: {
        name: null,
        site: null,
        description: null
      },
      categoryModel: false,
      categoryMode: null,
      siteColumns: [
        {
          title: '站点',
          key: 'name'
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
      siteData: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        }]
    };
  },
  computed: {

  },
  mounted() {
    this.siteList()
  },
  methods: {
    // 新增
    siteModeAdd() {
      this.siteModal = true;
      this.siteMode = 'add'
    },
    // 更新
    siteModeUpdate() {
      this.siteModal = true;
      this.siteMode = 'update'

    },
    async ok() {
      if (this.siteMode === 'add') {
        const params = {
          url: 'crawler/site/add',
          payload: this.form,
          auth: true
        }

        const result = await this.post(params)
        if (result.code === 1) {
          this.siteList()
        }

      }
      if (this.siteMode === 'update') {
        const params = {
          url: 'crawler/site/update',
          payload: this.form
        }
        const result = await this.post(params)
        if (result.code === 1) {
          this.siteList()
        }

      }
    },
    cancel() { },
    async siteList() {
      const params = {
        url: 'crawler/site/list',
        payload: {

        }
      }
      const result = await this.get(params)
      this.siteData = result.data
    },
    async categoryList(site_id) {
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
  }
};
</script>
<style lang="stylus">
</style>
