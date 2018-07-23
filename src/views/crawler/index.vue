<template>
  <div>
    <Row>
      <Col span="8">
      <Card>
        <p slot="title">
          <Icon type="android-contact"></Icon>
          爬取网站列表
        </p>
        <Button slot="extra" type="primary">点击上传</Button>
        <div>
          <Table :columns="siteColumns" :data="siteData"></Table>
        </div>
      </Card>
      </Col>
      <Col span="8" style="padding-left:10px">
      <Card>
        <p slot="title">
          <Icon type="android-contact"></Icon>
          网站分类
        </p>
        <Button slot="extra" type="primary" @click="categoryModel='add'">新增分类</Button>
        <div>
          <Table :columns="categoryColumns" :data="categoryData"></Table>
        </div>
      </Card>
      </Col>
      <Col span="8" style="padding-left:10px">
      <Card>
        <p slot="title">
          <Icon type="android-contact"></Icon>
          进度
        </p>
        <div>

        </div>
      </Card>
      </Col>
    </Row>
    <Modal v-model="categoryModel" :title="categoryModel==='add'?'新增分类':'更新分类'" @on-ok="ok" @on-cancel="cancel">
      <Form :model="cform" label-position="top">
        <FormItem label="原网站分类">
          <Input v-model="cform.origin_category"></Input>
        </FormItem>
        <FormItem label="原网站分类id">
          <Input v-model="cform.origin_id"></Input>
        </FormItem>
        <FormItem label="本系统内对应分类">
          <Input v-model="cform.target_category"></Input>
        </FormItem>
        <FormItem label="对应爬虫规则">
          <Input v-model="cform.crule"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cform: {
        origin_category: '',
        origin_id: '',
        target_category: '',
        crule: ''
      },
      categoryModel: false,
      siteColumns: [
        {
          title: '站点',
          key: 'name'
        },
        {
          title: '操作',
          key: 'age',
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
                    this.categoryList(params.row._id)
                  }
                }
              }, '爬虫分类'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, '编辑一下')
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
        }],
      categoryColumns: [
        {
          title: '分类',
          key: 'origin_category'
        },
        {
          title: '操作',
          key: 'age',
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
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    const row = params.row
                    const { origin_category, origin_id, target_category, _id, crule } = row
                    this.cform.origin_category = origin_category;
                    this.cform.origin_id = origin_id;
                    this.cform.target_category = target_category;
                    this.categoryModel = 'edit'
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
  mounted() {
    this.siteList()
  },
  methods: {
    editCategory() {
      if (this.categoryModel === 'add') {

      }
      if (this.categoryModel === 'edit') {

      }
    },
    ok() { },
    cancel() { },
    async siteList() {
      const params = {
        url: 'crawler/site/list',
        payload: {

        }
      }
      const result = await this.get(params)
      this.siteData = result.data
      console.log('看看站点')
      console.log(result)
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
