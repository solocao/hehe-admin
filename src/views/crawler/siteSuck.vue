<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="android-contact"></Icon>
        中国企业网 爬虫分类
      </p>
      <div slot="extra">
        <Button size="small" type="ghost" @click="siteSuck">爬取</Button>
      </div>
      <Form :model="form" label-position="left" :label-width="100">
        <FormItem label="网站名称">
          <Input v-model="form.sites" type="textarea" :rows="8"></Input>

        </FormItem>
        <FormItem label="爬虫规则id">
          <Input v-model="form.crule_id"></Input>
        </FormItem>
        <FormItem label="目标分类id">
          <Input v-model="form.category_id"></Input>
        </FormItem>
      </Form>
    </Card>

  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        sites: null,
        crule_id: null,
        category_id: null
      }
    };
  },
  methods: {
    async siteSuck() {
      const formCopy = JSON.parse(JSON.stringify(this.form))
      Object.keys(formCopy).map(x => {
        if (formCopy[x] === null) {
          delete formCopy[x]
        }
      })

      const params = {
        url: 'crawler/site/suck',
        payload: formCopy
      }
      const result = await this.post(params)
      console.log(result)

    }
  }

};
</script>
<style lang="stylus">
</style>


