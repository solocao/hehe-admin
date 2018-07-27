<template>
  <div>
    <Row>
      <Col span="24">
      <Card>
        <p slot="title">
          <Icon type="android-contact"></Icon>
          爬虫记录
        </p>
        <div slot="extra">
          <Button size="small" type="ghost" @click="categoryAdd">新增</Button>
          <Button size="small" type="ghost" @click="categoryList">刷新</Button>
        </div>
        <div>
          <Table :columns="recordColumns" :data="recordData"></Table>
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
      recordColumns: [
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '原文链接',
          key: 'site'
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
          key: 'action',
          render: (h, params) => {
            return h('Dropdown', {
              props: {
                transfer: true
              }
            }, [
                h('Button', {
                  props: {
                    type: 'ghost',
                    size: 'small'
                  }
                }, '更多操作'),
                h('DropdownMenu', {
                  slot: 'list'
                }, [
                    h('DropdownItem', '详情')
                  ])
              ])
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
      recordData: []

    };
  },
  methods: {
    async  recordList() {
      const params = {
        url: 'crawler/record/list',
        payload: {}
      };
      const result = await this.post(params)
      this.recordData = result.data
      consoel.log('看看结果')
      consoel.log(result)
    }
  },
  mounted() {
    this.recordList()
  }

};
</script>

<style lang="stylus">
</style>
