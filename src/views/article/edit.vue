
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
          <Select size="small" style="width:90px" value="草稿">
            <Option v-for="item in articleStateList" :value="item.value" :key="item.value">{{ item.value }}</Option>
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
            <Button @click="articleUpdate" :loading="publishLoading" type="primary">保存</Button>
          </span>
        </Row>
      </Card>
      <div class="margin-top-10">
        <Card>
          <p slot="title">
            <Icon type="navicon-round"></Icon>
            分类目录
          </p>
          <Tabs type="card">
            <TabPane label="所有分类目录">
              <div class="classification-con">
                <Tree ref="categoryTree" :data="classificationList" @on-check-change="setClassificationInAll" show-checkbox></Tree>
              </div>
            </TabPane>
            <TabPane label="常用目录">
              <div class="classification-con">
                <CheckboxGroup v-model="offenUsedClassSelected" @on-change="setClassificationInOffen">
                  <p v-for="item in offenUsedClass" :key="item.title">
                    <Checkbox :label="item.title">{{ item.title }}</Checkbox>
                  </p>
                </CheckboxGroup>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>

      </Col>
    </Row>
  </div>
</template>

<script>
import contentForm from './contentForm.vue'

export default {
  name: 'artical-publish',
  components: {
    contentForm
  },
  data() {
    return {
      article_id: null,
      content: '<h2>I am Example</h2>',
      editorOption: {
        // some quill options
      },
      // 标题
      title: '',
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
      articleStateList: [{ value: '草稿' }, { value: '等待复审' }],
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
      newTagName: '' // 新建标签名
    };
  },
  methods: {
    async getArticle() {
      const params = {
        url: 'article/item/' + this.article_id,
        payload: {}
      }
      const result = await this.get(params)
      if (result.code === 1) {
        this.$refs.form.setForm(result.data)
      }
    },
    // 获取分类列表树
    async categoryList() {
      const params = {
        url: 'category/list',
        payload: {}
      }
      const result = await this.post(params)
      const data = result.data
      function nodeTree(tree) {
        tree.forEach(e => {
          e.title = e.name
          e.expand = true
          if (e.children === undefined) {
            return
          } else {
            nodeTree(e.children)
          }
        });
      }
      nodeTree(data)
      this.classificationList = data
    },
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

    },
    async articleUpdate() {
      if (!this.$refs.form.validForm) {
        return false
      }
      const formData = this.$refs.form.getForm();
      console.log('看看form')
      console.log(formData)
      return ''
      this.publishLoading = true;
      const params = {
        url: '/article/update',
        payload: Object.assign({}, formData, {
          category: JSON.stringify(this.$refs.categoryTree.getCheckedNodes().map(x => { return x._id }))        }),
        auth: true
      }
      const result = await this.post(params)
      this.publishLoading = false;
      if (result.code === 1) {
        this.$Notice.success({
          title: '成功',
          desc: '文章《' + this.title + '》保存成功',
          duration: 3
        });
      } else {
        this.$Notice.success({
          title: '发送失败',
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
    this.article_id = this.$route.query.article_id
    this.getArticle()
    this.categoryList()
    this.classificationList = [
      {
        title: 'Vue实例',
        expand: true,
        children: [
          {
            title: '数据与方法',
            expand: true
          },
          {
            title: '生命周期',
            expand: true
          }
        ]
      },
      {
        title: 'Class与Style绑定',
        expand: true,
        children: [
          {
            title: '绑定HTML class',
            expand: true,
            children: [
              {
                title: '对象语法',
                expand: true
              },
              {
                title: '数组语法',
                expand: true
              },
              {
                title: '用在组件上',
                expand: true
              }
            ]
          },
          {
            title: '生命周期',
            expand: true
          }
        ]
      },
      {
        title: '模板语法',
        expand: true,
        children: [
          {
            title: '插值',
            expand: true
          },
          {
            title: '指令',
            expand: true
          },
          {
            title: '缩写',
            expand: true
          }
        ]
      }
    ];
    this.offenUsedClass = [
      {
        title: 'vue实例'
      },
      {
        title: '生命周期'
      },
      {
        title: '模板语法'
      },
      {
        title: '插值'
      },
      {
        title: '缩写'
      }
    ];

  },

};
</script>
<style lang="stylus">

@import '../../styles/common.styl';
@import './edit.styl';
</style>
