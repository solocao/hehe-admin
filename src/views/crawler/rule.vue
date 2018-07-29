<template>
  <div>
    <Row>
      <Col span="24">
      <Card>
        <p slot="title">
          <Icon type="android-contact"></Icon>
          爬取网站列表
        </p>
        <Button slot="extra" type="primary">新增规则</Button>
        <div>
          <Table :columns="columns" :data="data"></Table>
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
      columns: [
        {
          title: 'ID',
          key: '_id'
        },
        {
          title: '名称',
          key: 'name',
          render: (h, params) => {
            const row = params.row
            return (<a href="">{row.name}</a>)
          }
        },
        {
          title: '描述',
          key: 'description'
        },
        {
          title: '站点',
          key: 'site'
        },
        {
          title: '操作',
          key: 'site',
          width: 120,
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
                    const { _id } = params.row
                    this.$router.push({
                      path: '/crawler/add',
                      query: { rule_id: _id }
                    });
                  }
                }
              }, '查看规则'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    const { _id } = params.row
                    this.ruleDelete(_id)
                  }
                }
              }, '删除规则')
            ]);
          }
        },
      ],
      data: []

    };
  },
  methods: {
    format() {
      const context = this.codeEditor.getValue();
      let code = jsBeautify.js_beautify(context, { indent_size: 2 });
      this.codeEditor.setValue(code);
    },
    // 获取爬虫规则
    async ruleList() {
      const params = {
        url: '/crawler/rule/list',
        payload: {

        }
      }
      const result = await this.get(params)
      if (result.code == 1) {
        this.data = result.data
      }
      console.log(result)
    },
    async ruleTest() {
      const params = {
        url: 'crawler/rule/test',
        payload: {
          site: this.site,
          rule: this.codeEditor.getValue()
        }
      }
      const result = await this.post(params)
      this.data = result.data
      // if (result.code == 1) {
      //   this.data = result.data
      //   alert('赋值')
      // }
    },
    async ruleDelete(rule_id) {
      const params = {
        url: 'crawler/rule/delete',
        payload: {
          rule_id: rule_id,
        }
      }
      const result = await this.post(params)
      if (result.code === 1) {
        this.ruleList();
        this.$Message.info('爬虫删除完成');
      }
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

    this.ruleList()
  }

};
</script>
<style lang="stylus">
</style>
