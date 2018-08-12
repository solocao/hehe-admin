<template>
  <div>
    <Row>
      <Col span="24">
      <Card>
        <p slot="title">
          <Icon type="images"></Icon>
          标签管理
        </p>
        <div slot="extra">
          <Button size="small" type="ghost" @click="tagAdd">新增</Button>
          <Button size="small" type="ghost" @click="tagList">刷新</Button>
        </div>
        <Table :data="tableData" :columns="tableColumns1" stripe ref="table2image"></Table>
      </Card>
      </Col>
    </Row>
    <Modal v-model="tagModal" :title="tagMode==='add'?'新增标签':'更新标签'" @on-ok="ok" @on-cancel="cancel">
      <Form :model="form" label-position="left" :label-width="60">
        <FormItem label="标签">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="别名">
          <Input v-model="form.slug"></Input>
        </FormItem>
        <FormItem label="描述">
          <Input type="textarea" v-model="form.description"></Input>
        </FormItem>
        <FormItem label="颜色">
          <Input type="textarea" v-model="form.color"></Input>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>
<script>
import util from '../../libs/util.js';
export default {
  data() {
    return {
      tagModal: false,
      tagMode: null,
      tableData: [],
      imageName: '',
      form: {
        _id: null,
        name: null,
        slug: null,
        description: null,
        color: null
      },
      tableColumns1: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '标签ID',
          key: '_id'
        },
        {
          title: '别名',
          key: 'slug'
        },
        {
          title: '描述',
          key: 'description'
        },
        {
          title: '创建时间',
          key: 'create_at',
          render(h, params) {
            const { create_at } = params.row;
            return (<span>{util.timeS(create_at)}</span>)
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
                    const row = params.row
                    this.tagUpdate(row)
                  }
                }
              }, '编辑')
            ]);
          }
        },
      ]
    };
  },
  methods: {
    async ok() {
      if (this.tagMode === 'add') {
        const params = {
          url: '/tag/add',
          payload: {
            name: this.form.name,
            slug: this.form.slug,
            description: this.form.description
          },
          auth: true
        }
        const result = await this.post(params)
        if (result.code === 1) {
          this.$Message.info(result.msg)
          this.tagList()
        } else {
          this.$Message.console.warn(result.msg);
          (result.msg)
        }
      }
      if (this.tagMode === 'update') {
        const params = {
          url: '/tag/update',
          payload: {
            _id: this.form._id,
            name: this.form.name,
            slug: this.form.slug,
            description: this.form.description
          },
          auth: true
        }
        const result = await this.post(params)
        if (result.code === 1) {
          this.$Message.info(result.msg)
          this.tagList()
        } else {
          this.$Message.console.warn(result.msg);
          (result.msg)
        }
      }
    },
    cancel() {

    },

    async tagList() {
      const params = {
        url: '/tag/list',
        payload: {

        }
      }
      const result = await this.post(params)
      this.tableData = result.data
      console.log('看看标签')
      console.log(result)
    },
    // 创建标签
    async tagAdd() {
      this.tagModal = true;
      this.tagMode = 'add';
      // 标签名称
      this.form.name = null;
      // 标签别名
      this.form.slug = null;
      // 标签描述
      this.form.description = null;
    },
    // 编辑更新标签
    tagUpdate(row) {
      this.tagModal = true;
      this.tagMode = 'update';
      const { _id, name, slug, description } = row
      // 标签id
      this.form._id = _id;
      // 标签名称
      this.form.name = name;
      // 标签别名
      this.form.slug = slug;
      // 标签描述
      this.form.description = description;
    },
    mockTableData1() {
      let data = [];
      for (let i = 0; i < 10; i++) {
        data.push({
          name: '商圈' + Math.floor(Math.random() * 100 + 1),
          status: Math.floor(Math.random() * 3 + 1),
          portrayal: ['城市渗透', '人群迁移', '消费指数', '生活指数', '娱乐指数'],
          people: [
            {
              n: '客群' + Math.floor(Math.random() * 100 + 1),
              c: Math.floor(Math.random() * 1000000 + 100000)
            },
            {
              n: '客群' + Math.floor(Math.random() * 100 + 1),
              c: Math.floor(Math.random() * 1000000 + 100000)
            },
            {
              n: '客群' + Math.floor(Math.random() * 100 + 1),
              c: Math.floor(Math.random() * 1000000 + 100000)
            }
          ],
          time: Math.floor(Math.random() * 7 + 1),
          update: new Date()
        });
      }
      return data;
    },
    formatDate(date) {
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      return y + '-' + m + '-' + d;
    }

  },
  mounted() {
    this.tagList()
  }
};
</script>

<style lang="stylus">
@import './tag.styl';
</style>


