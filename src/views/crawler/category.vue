<template>
  <div class="crawler-category">
    <Row>
      <Col span="12">
      <Card>
        <p slot="title">
          <Icon type="android-contact"></Icon>
          中国企业网 爬虫分类
        </p>
        <Button slot="extra" size="small" type="primary">新增分类</Button>
        <div>
          <Table :columns="categoryColumns" :data="categoryData"></Table>
        </div>
      </Card>
      </Col>
      <Col span="12" style="padding-left:10px">
      <Card>
        <p slot="title">
          <Icon type="android-contact"></Icon>
          中国企业网 爬虫分类
        </p>
        <Button slot="extra" size="small" type="primary">新增分类</Button>
        <div>
          <Table :columns="categoryColumns" :data="categoryData"></Table>
        </div>
      </Card>
      </Col>
    </Row>
    <Modal v-model="categoryModel" :title="categoryMode==='add'?'新增分类':'更新分类'" @on-ok="editCategory" @on-cancel="cancel">
      <Form :model="cform" label-position="left" :label-width="100">
        <FormItem label="网站分类">
          <Input v-model="cform.origin_category"></Input>
        </FormItem>
        <FormItem label="网站地址">
          <Input v-model="cform.url"></Input>
        </FormItem>
        <FormItem label="网站分类ID">
          <Input v-model="cform.origin_id"></Input>
        </FormItem>
        <FormItem label="系统内分类">
          <Input v-model="cform.target_category"></Input>
        </FormItem>
        <FormItem label="爬列表规则">
          <Input v-model="cform.list_rule"></Input>
        </FormItem>
        <FormItem label="爬详情规则">
          <Input v-model="cform.detail_rule"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      categoryModel: false,
      categoryMode: null,
      cform: {
        site_category_id: '5b5424ef8b4ee5a918ac2412',
        origin_category: null,
        origin_id: null,
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
                    const row = params.row
                    console.log()
                    const { origin_category, origin_id, target_category, _id, crule, list_rule, detail_rule } = row
                    this.cform.site_category_id = _id;
                    this.cform.origin_category = origin_category;
                    this.cform.origin_id = origin_id;
                    this.cform.target_category = target_category;
                    this.cform.list_rule = list_rule;
                    this.cform.detail_rule = detail_rule;
                    this.categoryModel = true;
                    this.categoryMode = 'edit';
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
    async editCategory() {
      if (this.categoryMode === 'add') {

      }
      if (this.categoryMode === 'edit') {
        const cformCopy = JSON.parse(JSON.stringify(this.cform))
        Object.keys(cformCopy).map(x => {
          if (cformCopy[x] === null)
            delete cformCopy[x]
        })
        const params = {
          url: '/crawler/site/category/update',
          payload: cformCopy
        }
        const result = await this.post(params)
        this.categoryList('5b5424ef8b4ee5a918ac2412')
      }
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
  },
  mounted() {
    this.categoryList('5b5424ef8b4ee5a918ac2412')



  }

};
</script>
<style lang="stylus">
</style>


