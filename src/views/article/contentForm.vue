<template>
  <div class="article-content-form">
    <Form ref="form" :model="form" :label-width="80" :rules="ruleValidate">
      <FormItem prop="title" label="文章标题">
        <Input v-model="form.title" />
      </FormItem>
      <FormItem label="原文链接">
        <Input v-model="form.link" />
      </FormItem>
      <FormItem label="关键字" :error="keyworError">
        <Input v-model="form.keyword" />
      </FormItem>
      <FormItem label="文章描述">
        <Input v-model="form.description" />
      </FormItem>
      <FormItem label="文章标签">
        <Tag @click.native="avtiveTag(t)" type="dot" :color="t.active?'blue':'grey'" v-for="t in tags" :key="t.name">{{t.name}}</Tag>
      </FormItem>
      <FormItem label="商品图片">
        <upload-card ref="uploadCard"></upload-card>
      </FormItem>
    </Form>
    <div class="margin-top-20">
      <textarea id="articleEditor"></textarea>
    </div>
  </div>

</template>
<script>
import uploadCard from '../utils/uploadCard.vue';
import tinymce from 'tinymce';
export default {
  components: {
    uploadCard
  },
  data() {
    return {
      // 文章内容
      form: {
        // 文章id
        _id: null,
        // 文章标题
        title: '文章标题',
        // 原文链接
        link: '',
        // 关键字
        keyword: [],
        // 商品别名
        slug: null,
        // 文章描述
        description: null,
        // 图片列表
        img_list: null,
        // 标签
        tag: [],
        // 文章状态
        state: 1,
        // 公开状态 -1私密，0需要密码，1公开
        public: 1,
      },
      tags: [],
      // 验证条件
      ruleValidate: {
        title: [
          { required: true, message: '文章标题不能为空', trigger: 'blur' }
        ],
        city: [
          { required: true, message: 'Please select the city', trigger: 'change' }
        ]
      }

    };
  },
  methods: {
    // 获取标签列表
    async tagList() {
      const params = {
        url: '/tag/list',
        payload: {
        }
      }
      const result = await this.post(params)
      const data = result.data
      data.forEach(x => {
        x.active = false
      })
      this.tags = result.data
    },
    avtiveTag(t) {
      t.active = !t.active;
    },
    // 验证表单数据是否填写完成
    validForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$Message.success('Success!');
          return true
        } else {
          this.$Message.error('Fail!');
          return false
        }
      })
    },
    // 获取form表单信息
    getForm() {
      // 获取图片
      this.form.img_list = this.$refs.uploadCard.getImageList();
      // 文章标签
      this.form.tag = JSON.stringify(this.tags.filter(x => x.active === true).map(x => { return x._id }));
      // 获取文章内容
      this.form.content = tinymce.activeEditor.getContent()
      let formCory = JSON.parse(JSON.stringify(this.form))
      const key = Object.keys(formCory).forEach(x => {
        if (formCory[x] === null || formCory[x] === '' || formCory[x] === [] || formCory[x] === '[]') {
          delete formCory[x]
        }
      })
      return formCory
    },
    // 设置form表单信息
    setForm(form) {
      console.log('看看表单信息')
      console.log(form)
      // 设置图片
      this.$refs.uploadCard.setImageList(form.img_list)
      // id
      this.form._id = form._id;
      // 标题
      this.form.title = form.title;
      // 关键词
      this.form.keyword = form.keyword;
      // 描述
      this.form.description = form.description;
      // 内容
      this.form.content = form.content
      // 分类 form.category
      // 标签 form.tag
      tinymce.activeEditor.setContent(this.form.content);
    },

    // 允许发布之前的权限验证
    canPublish() {
      this.avtiveTags = this.tags.filter(x => x.active === true);
      if (this.avtiveTags.length === 0) {
        this.$Message.error('请选择文章标签');
        return false;
      }
      this.activeCatogories = this.$refs.categoryTree.getCheckedNodes();
      if (this.activeCatogories.length === 0) {
        this.$Message.error('请选择文章分类');
        return false;
      }
      if (this.title.length === 0) {
        this.$Message.error('请输入文章标题');
        return false;
      } else {
        return true;
      }
    }

  },
  mounted() {
    // 获取标签列表
    this.tagList();
    tinymce.init({
      selector: '#articleEditor',
      branding: false,
      elementpath: false,
      height: 600,
      language: 'zh_CN.GB2312',
      menubar: 'edit insert view format table tools',
      theme: 'modern',
      plugins: [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
        'searchreplace visualblocks visualchars code fullscreen fullpage',
        'insertdatetime media nonbreaking save table contextmenu directionality',
        'emoticons paste textcolor colorpicker textpattern imagetools codesample'
      ],
      toolbar1: ' newnote print fullscreen preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
      autosave_interval: '20s',
      image_advtab: true,
      table_default_styles: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    });
  },
  destroyed() {
    tinymce.get('articleEditor').destroy();
  }
};
</script>
<style lang="stylus">
.article-content-form {
}
</style>

