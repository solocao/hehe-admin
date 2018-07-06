<template>
  <div>
    <Row>
      <Col span="16">

      <Card>
        <p slot="title" style="overflow:visible">
          <Icon type="images"></Icon>
          素材管理
          <span style="float:right">
            <Button type="primary" size="small">新增</Button>
          </span>

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
          <FormItem label="名称">
            <Input v-model="form.title"></Input>
          </FormItem>
          <FormItem label="描述">
            <Input v-model="form.description"></Input>
          </FormItem>
          <FormItem label="图片地址">
            <Button style="position:absolute;top:-28px;right:0px" @click="imgUploadShow=true" size="small" type="primary">上传图片</Button>
            <Input type="textarea" v-model="form.img_url"></Input>
          </FormItem>
          <FormItem label="跳转地址">
            <Input type="textarea" v-model="form.href_url"></Input>
          </FormItem>
        </Form>

        <Row class="margin-top-20 publish-button-con">
          <span class="publish-button" style="float:right">
            <Button @click="sliderItemAdd" :loading="false" icon="ios-checkmark" style="width:90px;" type="primary">确定</Button>
          </span>
        </Row>
      </Card>
      </Col>
    </Row>
    <my-upload field="img" @crop-success="cropSuccess" @crop-upload-success="cropUploadSuccess" @crop-upload-fail="cropUploadFail" v-model="imgUploadShow" :width="300" :height="300" :params="params" :headers="headers" img-format="png"></my-upload>
    <img :src="imgDataUrl">
  </div>
</template>
<script>
import myUpload from 'vue-image-crop-upload';
export default {
  components: {
    myUpload
  },
  data() {
    return {
      form: {
        title: null,
        description: null,
        img_url: null,
        href_url: null,
        type: 0
      },
      imgUploadShow: false,
      params: {
        token: '123456798',
        name: 'avatar'
      },
      headers: {
        smail: '*_~'
      },
      imgDataUrl: '',// the datebase64 url of created image
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
          key: 'title'
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
    toggleShow() {
      this.imgUploadShow = !this.imgUploadShow;
    },
    // base64 转 blob
    dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      let byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
      } else byteString = unescape(dataURI.split(',')[1]);

      // separate out the mime component
      const mimeString = dataURI
        .split(',')[0]
        .split(':')[1]
        .split(';')[0];

      // write the bytes of the string to a typed array
      const ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], { type: mimeString });
    },
    /**
     * crop success
     *
     * [param] imgDataUrl
     * [param] field
     */
    async cropSuccess(imgDataUrl, field) {
      console.log('-------- crop success --------');
      console.log(field)
      this.imgDataUrl = imgDataUrl;
      const blob = this.dataURItoBlob(imgDataUrl);
      const formData = new FormData();
      formData.append('file', blob);
      console.log(formData)
      const params = {
        url: '/store/file',
        payload: formData
      };
      const data = await this.upload(params);
    },
    /**
     * upload success
     *
     * [param] jsonData  server api return data, already json encode
     * [param] field
     */
    cropUploadSuccess(jsonData, field) {
      console.log('-------- upload success --------');
      console.log(jsonData);
      console.log('field: ' + field);
    },
    /**
     * upload fail
     *
     * [param] status    server api return error status, like 500
     * [param] field
     */
    cropUploadFail(status, field) {
      console.log('-------- upload fail --------');
      console.log(status);
      console.log('field: ' + field);
    },
    async sliderItemList() {
      const params = {
        url: '/slider/item/list',
        payload: {

        },
        auth: true
      }
      const result = await this.post(params)
      this.tableData = result.data
      console.log('看看标签')
      console.log(result)
    },
    // 创建标签
    async sliderItemAdd() {
      const params = {
        url: '/slider/item/add',
        payload: {
          title: this.form.title,
          description: this.form.description,
          img_url: this.form.img_url,
          href_url: this.form.href_url
        },
        auth: true
      }
      const result = await this.post(params)
      if (result.code === 1) {
        this.$Message.info(result.msg)
        this.sliderItemList()
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
    this.sliderItemList()
  }
};
</script>

<style lang="stylus">
@import './list.styl';
</style>


