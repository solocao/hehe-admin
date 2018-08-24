<template>
  <div>
    <Row>

      <Card>
        <p slot="title">
          <Icon type="images"></Icon>
          品牌管理
        </p>
        <div slot="extra">
          <Button size="small" type="ghost" @click="brandModalAdd">新增</Button>
          <Button size="small" type="ghost" @click="brandList">刷新</Button>
        </div>
        <Table :data="tableData" :columns="tableColumns1" stripe ref="table2image"></Table>
      </Card>

      <Col span="8" class="padding-left-10" v-if="false">
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
            <Upload class="form-upload" :action="uploadUrl" :on-success="uploadSuccess" :show-upload-list="false" :format="['jpg','jpeg','png']" :max-size="2048">
              <Button type="ghost" size="small" icon="ios-cloud-upload-outline">上传图片</Button>
            </Upload>
            <Input type="textarea" v-model="form.imgUrl"></Input>
          </FormItem>
        </Form>
        <Row class="margin-top-20 publish-button-con">
          <span class="publish-button" style="float:right">
            <Button @click="brandAdd" :loading="publishLoading" icon="ios-checkmark" style="width:90px;" type="primary">
              确定</Button>
          </span>
        </Row>
      </Card>

      </Col>
    </Row>

    <Modal v-model="brandModal" :title="brandMode==='add'?'新增品牌':'更新品牌'" @on-ok="ok" @on-cancel="cancel">
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
          <Upload class="form-upload" :action="uploadUrl" :on-success="uploadSuccess" :show-upload-list="false" :format="['jpg','jpeg','png']" :max-size="2048">
            <Button type="ghost" size="small" icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
          <Input type="textarea" v-model="form.imgUrl"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import config from '../../config'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      brandMode: null,
      brandModal: false,
      // add 增加  update 修改 保存
      btnType: 'add',
      uploadUrl: config.upload,
      tableData: [],
      imageName: '',
      form: {
        name: null,
        slug: null,
        description: null,
        color: null,
        imgUrl: null
      },
      tableColumns1: [
        {
          title: '名称',
          key: 'name',
          width: 200,
          render: (h, params) => {
            const row = params.row;
            const text = row.name
            const img_url = row.img_url
            return h('div', {
              style: {
                textAlign: 'center',
                padding: '0px',
                height: '100px',
                width: '160px',
                background: 'url(' + img_url + ')',
                backgroundSize: 'cover'
              }
            }, text);
          }
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
          render: (h, params) => {
            return h('span',
              dayjs(params.row.create_at).format('YYYY-MM-DD HH:mm:ss')
            );
          }
        },
        {
          title: '操作',
          key: 'state',
          render: (h, params) => {
            const row = params.row;
            return (<div class="a-fc" style="flexDirection: column;display: flex">
              <i-button class="a-mtp" size="small" title='查看' type='primary' onClick={() => this.brandModalUpdate(row)}>编辑品牌</i-button>
              <i-button class="a-mtp" size="small" title='查看' type='error' onClick={() => this.brandDelete(row._id)}>删除品牌</i-button>
            </div >)
          }
        }
      ]
    };
  },
  methods: {
    // 打开新增模态框
    brandModalAdd() {
      this.brandModal = true;
      this.brandMode = 'add';
    },
    // 更新
    brandModalUpdate(form) {
      console.log(form)
      this.brandModal = true;
      this.brandMode = 'update';
      const { name, slug, description, _id, img_url } = form;
      this.form._id = _id;
      this.form.name = name;
      this.form.slug = slug;
      this.form.description = description;
      this.form.imgUrl = img_url;
    },

    ok() {
      if (this.brandMode === 'add') {
        this.brandAdd()
      }
      if (this.brandMode === 'update') {
        this.brandUpdate()
      }

    },
    // 处理上传成功
    uploadSuccess(evnet, file) {
      this.$Message.info('图片上传成功')
      this.form.imgUrl = file.response.url
    },
    // 删除
    delete(row) {
      alert('开始删除')
    },
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
          img_url: this.form.imgUrl
        },
        auth: true
      }
      const result = await this.post(params)
      if (result.code === 1) {
        this.form.name = null
        this.form.slug = null
        this.form.description = null
        this.form.imgUrl = null
        this.$Message.info(result.msg)
        this.brandList()
      } else {
        this.$Message.console.warn(result.msg);
        (result.msg)
      }
    },
    // 更新品牌
    async brandUpdate() {
      const params = {
        url: '/brand/update',
        payload: {
          _id: this.form._id,
          name: this.form.name,
          slug: this.form.slug,
          description: this.form.description,
          img_url: this.form.imgUrl
        },
        auth: true
      }
      const result = await this.post(params)
      if (result.code === 1) {
        this.form.name = null
        this.form.slug = null
        this.form.description = null
        this.form.imgUrl = null
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

.form-upload {
  position: absolute;
  top: -33px;
  right: 0px;
}

.a-mtp {
  margin-top: 2px;
  margin-bottom: 2px;
}
</style>


