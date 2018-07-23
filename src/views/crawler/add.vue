<template>
  <div>
    <Row>
      <Col span="12">
      <Card>
        <p slot="title">
          <Icon type="android-contact"></Icon>
          新增爬虫
        </p>
        <Button slot="extra" type="primary" @click="addRule">确认保存</Button>
        <div>
          <Form :model="form" label-position="left" :label-width="100">
            <FormItem label="爬虫名称">
              <Input v-model="form.name"></Input>
            </FormItem>
            <FormItem label="爬虫demo站点">
              <Input v-model="form.site"></Input>
            </FormItem>
            <FormItem label="爬虫描述">
              <Input v-model="form.description"></Input>
            </FormItem>
          </Form>
          <div style="height:800px;width:100%">
            <div style="width:100%;height:100%" ref="codeEditor"></div>
          </div>
        </div>
      </Card>
      </Col>
      <Col span="12" style="padding-left:10px">
      <Card>
        <p slot="title">
          <Icon type="android-contact"></Icon>
          爬虫结果
        </p>
        <Button slot="extra" type="primary" @click="ruleTest">爬虫测试</Button>
        <div>
          <Input v-model="result" type="textarea" :autosize="{minRows: 30,maxRows: 80}" placeholder="Enter something..."></Input>

        </div>

      </Card>
      </Col>
    </Row>

  </div>
</template>
<script>
import jsBeautify from 'js-beautify/js/lib/beautify';
let ace;;
if (typeof window !== 'undefined') {
  ace = require('brace');
  require('brace/mode/javascript');
  require('brace/theme/monokai');
  require('brace/ext/language_tools');
  require('brace/ext/searchbox');
}
export default {
  data() {
    return {
      codeEditor: null,
      site: null,
      form: {
        // 规则名称
        name: '中国企业网爬虫',
        site: 'http://www.qiye.gov.cn/news/qiye/gongs/23115.html',
        description: '爬单页文章',
        rule: ``
      },
      result: null
      // Columns: [],
      // Data: ''

    };
  },
  methods: {
    format() {
      const context = this.codeEditor.getValue();
      let code = jsBeautify.js_beautify(context, { indent_size: 2 });
      this.codeEditor.setValue(code);
    },
    async ruleTest() {
      const params = {
        url: 'crawler/rule/test',
        payload: {
          site: this.form.site,
          rule: this.codeEditor.getValue()
        }
      }
      const result = await this.post(params)
      this.result = jsBeautify.js_beautify(JSON.stringify(result), { indent_size: 2 });
      console.log(result)
    },
    async addRule() {
      this.form.rule = this.codeEditor.getValue()
      const formCopy = this.form
      const params = {
        url: 'crawler/rule/add',
        payload: formCopy
      }
      const result = await this.post(params)
      console.log(result)
    }
  },
  mounted() {
    this.codeEditor = ace.edit(this.$refs.codeEditor);
    this.codeEditor.getSession().setMode('ace/mode/javascript');
    this.codeEditor.setTheme('ace/theme/monokai');
    this.codeEditor.setOption('tabSize', 2);
    this.codeEditor.setOption('enableLiveAutocompletion', true);
    this.codeEditor.commands.addCommand({
      name: 'save',
      bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
      exec: () => {
        this.format();
      }
    });
  }

};
</script>
<style lang="stylus">
</style>
