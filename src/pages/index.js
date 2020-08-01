import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"

class IndexPage extends React.Component {
  render() {
    const siteTitle = "Blog của QuiLv"

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="Home"
          keywords={[`blog`, `lập trình`, `javascript`, `react`, `Xamarin`, `Unity`, `C Sharp`]}
        />
        <img style={{ margin: 0 }} src="./GatsbyScene.svg" alt="Gatsby Scene" />
        <h1>
          Chào mọi người{" "}
          <span role="img" aria-label="wave emoji">
            👋
          </span>
        </h1>
        <p>Chào mừng bạn ghé thăm trang web của Quilv.</p>
        <p>
          Đây là trang web cá nhân: vừa lưu giữ các kiến thức mình đã thu lượm trong quá trình học và làm và chia sẽ nó với góc nhìn của cá nhân mình.
        </p>
        <p>
          Hi vọng nó sẽ góp phần nho nhỏ cho bạn!
        </p>
        <p>GO GO GO!</p>
        <Link to="/blog/">
          <Button marginTop="35px">Xem Blog Nào</Button>
        </Link>
      </Layout>
    )
  }
}

export default IndexPage
