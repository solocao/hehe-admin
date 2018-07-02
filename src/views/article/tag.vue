<template>
  <div>
    <Row>
      <Col span="16">

      <Card>
        <p slot="title">
          <Icon type="images"></Icon>
          标签管理
        </p>

        <Table :data="tableData" :columns="tableColumns1" stripe ref="table2image"></Table>

      </Card>

      </Col>
      <Col span="8" class="padding-left-10">

      <Card>
        <p slot="title">
          <Icon type="paper-airplane"></Icon>
          编辑
        </p>
        <Form :model="tagForm" label-position="top">
          <FormItem label="标签">
            <Input v-model="tagForm.name"></Input>
          </FormItem>
          <FormItem label="别名">
            <Input v-model="tagForm.slug"></Input>
          </FormItem>
          <FormItem label="描述">
            <Input type="textarea" v-model="tagForm.description"></Input>
          </FormItem>
          <FormItem label="颜色">
            <Input type="textarea" v-model="tagForm.color"></Input>
          </FormItem>
        </Form>

        <Row class="margin-top-20 publish-button-con">
          <span class="publish-button" style="float:right">
            <Button @click="tagAdd" :loading="publishLoading" icon="ios-checkmark" style="width:90px;" type="primary">确定</Button>
          </span>
        </Row>
      </Card>

      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      imageName: '',
      tagForm: {
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
          title: '别名',
          key: 'slug'
        },
        {
          title: '描述',
          key: 'description'
        },
        {
          title: '创建时间',
          key: 'create_at'
        }
      ]
    };
  },
  methods: {
    async taglist() {
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
      const params = {
        url: '/tag/add',
        payload: {
          name: this.tagForm.name,
          slug: this.tagForm.slug,
          description: this.tagForm.description
        },
        auth: true
      }
      const result = await this.post(params)
      if (result.code === 1) {
        this.$Message.info(result.msg)
        this.taglist()
      } else {
        this.$Message.console.warn(result.msg);
        (result.msg)
      }
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
    this.taglist()
  }
};
</script>

<style lang="stylus">
@import './tag.styl';
</style>


