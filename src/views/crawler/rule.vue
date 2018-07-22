<template>
  <div>
    <Row>
      <Col span="12">
      <Card>
        <p slot="title">
          <Icon type="android-contact"></Icon>
          爬取网站列表
        </p>
        <Button slot="extra" type="primary">点击上传</Button>
        <div>
          <Table :columns="Columns" :data="Data"></Table>
        </div>
      </Card>
      </Col>
      <Col span="12">
      <Card>
        <p slot="title">
          <Icon type="android-contact"></Icon>
          编辑器
        </p>
        <Button slot="extra" type="primary">点击上传</Button>
        <div>
          <Table :columns="Columns" :data="Data"></Table>
        </div>
      </Card>
      </Col>
    </Row>

  </div>
</template>
<script>
export default {

};
</script>
<style lang="stylus">
</style>
