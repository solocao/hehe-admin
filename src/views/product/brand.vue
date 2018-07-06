<template>
  <div>
    <Row>
      <Col span="16">

      <Card>
        <p slot="title">
          <Icon type="images"></Icon>
          品牌管理
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
        <Form :model="form" label-position="top">
          <FormItem label="品牌名称">
            <Input v-model="form.name"></Input>
          </FormItem>
          <FormItem label="品牌别名">
            <Input v-model="form.slug"></Input>
          </FormItem>
          <FormItem label="品牌描述">
            <Input type="textarea" v-model="form.description"></Input>
          </FormItem>
          <FormItem label="图片地址">
            <Input type="textarea" v-model="form.image"></Input>
          </FormItem>
        </Form>
        <Row class="margin-top-20 publish-button-con">
          <span class="publish-button" style="float:right">
            <Button @click="brandAdd" :loading="publishLoading" icon="ios-checkmark" style="width:90px;" type="primary">确定</Button>
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
      form: {
        name: null,
        slug: null,
        description: null,
        color: null,
        image: null
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
    async brandList() {
      const params = {
        url: '/brand/list',
        payload: {

        }
      }
      const result = await this.post(params)
      this.tableData = result.data
      console.log('brand')
      console.log(result)
    },
    // 创建品牌
    async brandAdd() {
      const params = {
        url: '/brand/add',
        payload: {
          name: this.form.name,
          slug: this.form.slug,
          description: this.form.description,
          img_url: this.form.image
        },
        auth: true
      }
      const result = await this.post(params)
      if (result.code === 1) {
        this.form.name = null
        this.form.slug = null
        this.form.description = null
        this.form.image = null
        this.$Message.info(result.msg)
        this.brandList()
      } else {
        this.$Message.console.warn(result.msg);
        (result.msg)
      }
    }
  },
  mounted() {
    this.brandList()
  }
};
</script>

<style lang="stylus">
@import './brand.styl';
</style>


