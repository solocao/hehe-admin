
<template>
  <div>
    <Row>
      <Col span="18">
      <Card>
        <content-form ref="form"></content-form>
      </Card>
      </Col>
      <Col span="6" class="padding-left-10">
      <Card>
        <p slot="title">
          <Icon type="paper-airplane"></Icon>
          发布
        </p>
        <p class="margin-top-10">
          <Icon type="android-time"></Icon>&nbsp;&nbsp;状&nbsp;&nbsp;&nbsp; 态：
          <Select size="small" style="width:90px" v-model="form.state">
            <Option v-for="item in articleStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </p>
        <p class="margin-top-10">
          <Icon type="eye"></Icon>&nbsp;&nbsp;公开度：&nbsp;
          <b>{{ Openness }}</b>
          <Button v-show="!editOpenness" size="small" @click="handleEditOpenness" type="text">修改</Button>
          <transition name="openness-con">
            <div v-show="editOpenness" class="openness-radio-con">
              <RadioGroup v-model="currentOpenness" vertical>
                <Radio label="公开">
                  公开
                  <Checkbox v-show="currentOpenness === '公开'" v-model="topArticle">在首页置顶这篇文章</Checkbox>
                </Radio>
                <Radio label="密码">
                  密码
                  <Input v-show="currentOpenness === '密码'" style="width:120px" size="small" placeholder="请输入密码" />
                </Radio>
                <Radio label="私密"></Radio>
              </RadioGroup>
              <div>
                <Button type="primary" @click="handleSaveOpenness">确认</Button>
                <Button type="ghost" @click="cancelEditOpenness">取消</Button>
              </div>
            </div>
          </transition>
        </p>
        <p class="margin-top-10">
          <Icon type="ios-calendar-outline"></Icon>&nbsp;&nbsp;
          <span v-if="publishTimeType === 'immediately'">立即发布</span>
          <span v-else>定时：{{ publishTime }}</span>
          <Button v-show="!editPublishTime" size="small" @click="handleEditPublishTime" type="text">修改</Button>
          <transition name="publish-time">
            <div v-show="editPublishTime" class="publish-time-picker-con">
              <div class="margin-top-10">
                <DatePicker @on-change="setPublishTime" type="datetime" style="width:200px;" placeholder="选择日期和时间"></DatePicker>
              </div>
              <div class="margin-top-10">
                <Button type="primary" @click="handleSavePublishTime">确认</Button>
                <Button type="ghost" @click="cancelEditPublishTime">取消</Button>
              </div>
            </div>
          </transition>
        </p>
        <Row class="margin-top-20 publish-button-con">
          <span class="publish-button">
            <Button @click="handlePreview">预览</Button>
          </span>
          <span class="publish-button">
            <Button @click="handleSaveDraft">保存草稿</Button>
          </span>
          <span class="publish-button">
            <Button @click="publishProduct" :loading="publishLoading" type="primary">发布</Button>
          </span>
        </Row>
      </Card>
      <div class="margin-top-10">
        <Card>
          <p slot="title">
            <Icon type="navicon-round"></Icon>
            商品报价
          </p>
          <Form :label-width="80">
            <FormItem label="市场价">
              <Input v-model="form.official_price" />
            </FormItem>
            <FormItem label="本店售价">
              <Input v-model="form.sale_price" />
            </FormItem>
            <FormItem label="库存数量">
              <Input v-model="form.count" />
            </FormItem>
          </Form>
        </Card>
      </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import tinymce from 'tinymce';
import contentForm from './contentForm.vue'
import config from '../../config'

export default {
  name: 'product-add',
  components: {
    contentForm
  },
  data() {
    return {
      imageList: [],
      value1: [],
      data1: [{
        value: 'beijing',
        label: '北京',
        _label: 'asf'      }
      ],
      data: [{
        create_at: "2018-07-06T10:06:17.756Z",
        create_user: "5b388dd281a1a55c0588c78f",
        description: "阿迪达斯",
        extends: [],
        id: 1,
        label: "阿迪达斯",
        name: "阿迪达斯",
        pid: null,
        slug: "adidas",
        value: "5b3f3f193938383b7b8a9ce9",
        __v: 0,
        _id: "5b3f3f193938383b7b8a9ce9"
      }],
      content: '<h2>I am Example</h2>',

      brandValue: ["5b3f3f193938383b7b8a9ce9"],
      editorOption: {
        // some quill options
      },
      // 商品表单
      form: {
        // 商品名称
        name: '测试商品',
        // 商品内容
        content: 'afsafaee',
        // 商品别名
        slug: null,
        // 商品描述
        description: null,
        // 官方售价
        official_price: 1300,
        // 实际售价
        sale_price: 100,
        // 图片列表
        img_list: null,
        // 标签
        tag: [],
        // 品牌
        brand: [],
        // 关键字
        keyword: [],
        // 文章状态
        state: 1,
        // 公开状态 -1私密，0需要密码，1公开
        public: 1,
        count: 12
      },
      tags: null,
      avtiveTags: null,
      activeCatogories: null,
      // 关键字
      keyword: '',
      // 描述
      description: '',
      articleError: '',
      showLink: false,
      fixedLink: '',
      articlePath: '',
      articlePathHasEdited: false,
      editLink: false,
      editPathButtonType: 'ghost',
      editPathButtonText: '编辑',
      articleStateList: [{ value: 0, label: '草稿' }, { value: 1, label: '正式' }],
      editOpenness: false,
      Openness: '公开',
      currentOpenness: '公开',
      topArticle: false,
      publishTime: '',
      publishTimeType: 'immediately',
      editPublishTime: false, // 是否正在编辑发布时间
      articleTagSelected: [], // 文章选中的标签
      classificationList: [],
      classificationSelected: [], // 在所有分类目录中选中的目录数组
      offenUsedClass: [],
      offenUsedClassSelected: [], // 常用目录选中的目录
      classificationFinalSelected: [], // 最后实际选择的目录
      publishLoading: false,
      addingNewTag: false, // 添加新标签
      newTagName: '', // 新建标签
    };
  },
  methods: {

    editArticlePath() {
      this.editLink = !this.editLink;
      this.editPathButtonType = this.editPathButtonType === 'ghost' ? 'success' : 'ghost';
      this.editPathButtonText = this.editPathButtonText === '编辑' ? '完成' : '编辑';
    },
    handleEditOpenness() {
      this.editOpenness = !this.editOpenness;
    },
    handleSaveOpenness() {
      this.Openness = this.currentOpenness;
      this.editOpenness = false;
    },
    cancelEditOpenness() {
      this.currentOpenness = this.Openness;
      this.editOpenness = false;
    },
    handleEditPublishTime() {
      this.editPublishTime = !this.editPublishTime;
    },
    handleSavePublishTime() {
      this.publishTimeType = 'timing';
      this.editPublishTime = false;
    },
    cancelEditPublishTime() {
      this.publishTimeType = 'immediately';
      this.editPublishTime = false;
    },
    setPublishTime(datetime) {
      this.publishTime = datetime;
    },
    setClassificationInAll(selectedArray) {
      this.classificationFinalSelected = selectedArray.map(item => {
        return item.title;
      });
      localStorage.classificationSelected = JSON.stringify(this.classificationFinalSelected); // 本地存储所选目录列表
    },
    setClassificationInOffen(selectedArray) {
      this.classificationFinalSelected = selectedArray;
    },
    handleAddNewTag() {
      this.addingNewTag = !this.addingNewTag;
    },
    createNewTag() {

    },
    cancelCreateNewTag() {
      this.newTagName = '';
      this.addingNewTag = false;
    },
    // 允许发布之前的权限验证
    canPublish() {

      return true

    },
    handlePreview() {
      if (this.canPublish()) {
        if (this.publishTimeType === 'immediately') {
          let date = new Date();
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate();
          let hour = date.getHours();
          let minute = date.getMinutes();
          let second = date.getSeconds();
          localStorage.publishTime = year + ' 年 ' + month + ' 月 ' + day + ' 日 -- ' + hour + ' : ' + minute + ' : ' + second;
        } else {
          localStorage.publishTime = this.publishTime; // 本地存储发布时间
        }
        localStorage.content = tinymce.activeEditor.getContent();
        this.$router.push({
          name: 'preview'
        });
      }
    },
    handleSaveDraft() {
      if (!this.canPublish()) {
        //
      }
    },
    async publishProduct() {
      if (!this.$refs.form.validForm) {
        return false
      }
      const formData = this.$refs.form.getForm();
      const params = {
        url: '/product/add',
        payload: formData,
        auth: true
      }
      const result = await this.post(params)
      this.publishLoading = false;
      if (result.code === 1) {
        this.$Notice.success({
          title: '商品发布成功',
          desc: '商品《' + formData.name + '》保存成功',
          duration: 3
        });
      } else {
        this.$Notice.success({
          title: '商品发布失败',
          desc: '请联系管理员',
          duration: 3
        });
      }
    },
    handleSelectTag() {
      localStorage.tagsList = JSON.stringify(this.articleTagSelected); // 本地存储文章标签列表
    }
  },
  computed: {
    completeUrl() {
      let finalUrl = this.fixedLink + this.articlePath;
      localStorage.finalUrl = finalUrl; // 本地存储完整文章路径
      return finalUrl;
    }
  },
  mounted() {

  },
  watch: {
    imageList: function (newValue, oldValue) {
      console.log(newValue)
    }
  }
};
</script>
<style lang="stylus">

@import '../../styles/common.styl';
@import 'add.styl';
</style>
