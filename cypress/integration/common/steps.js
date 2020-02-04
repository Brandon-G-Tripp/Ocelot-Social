import {
  Given,
  When,
  Then
} from "cypress-cucumber-preprocessor/steps";
import helpers from "../../support/helpers";
import { VERSION } from '../../constants/terms-and-conditions-version.js'
import locales from '../../../webapp/locales'
import orderBy from 'lodash/orderBy'

/* global cy  */

const languages = orderBy(locales, 'name')
let lastPost = {};

let loginCredentials = {
  email: "peterpan@example.org",
  password: "1234"
};
const termsAndConditionsAgreedVersion = {
  termsAndConditionsAgreedVersion: VERSION
};
const narratorParams = {
  id: 'id-of-peter-pan',
  name: "Peter Pan",
  slug: "peter-pan",
  avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/nerrsoft/128.jpg",
  ...termsAndConditionsAgreedVersion,
};

const annoyingParams = {
  email: "spammy-spammer@example.org",
  slug: 'spammy-spammer',
  password: "1234",
};

Given("I am logged in", () => {
  cy.login(loginCredentials);
});

Given("the {string} user searches for {string}", (_, postTitle) => {
  cy.logout()
    .login({ email: annoyingParams.email, password: '1234' })
    .get(".searchable-input .ds-select-search")
    .focus()
    .type(postTitle);
});

Given("we have a selection of categories", () => {
  cy.factory().build('category', { id: "cat0", slug: "just-for-fun" });
});

Given("we have a selection of tags and categories as well as posts", () => {
  cy.factory()
    .build('category', { id: 'cat12', name: "Just For Fun", icon: "smile", })
    .build('category', { id: 'cat121', name: "Happiness & Values", icon: "heart-o"})
    .build('category', { id: 'cat122', name: "Health & Wellbeing", icon: "medkit"})
    .build("tag", { id: "Ecology" })
    .build("tag", { id: "Nature" })
    .build("tag", { id: "Democracy" })
    .build("user", { id: 'a1' })
    .build("post", {}, {
      authorId: 'a1',
      tagIds: ["Ecology", "Nature", "Democracy"],
      categoryIds: ["cat12"]
    })
    .build("post", {}, {
      authorId: 'a1',
      tagIds: ["Nature", "Democracy"],
      categoryIds: ["cat121"]
    })
    .build("user", { id: 'a2' })
    .build("post", {}, {
      authorId: 'a2',
      tagIds: ['Nature', 'Democracy'],
      categoryIds: ["cat12"]
    })
    .build("post", {}, {
      tagIds: ['Democracy'],
      categoryIds: ["cat122"]
    })
});

Given("we have the following user accounts:", table => {
  table.hashes().forEach(params => {
    cy.factory().build("user", {
      ...params,
      ...termsAndConditionsAgreedVersion
    }, params);
  });
});

Given("I have a user account", () => {
  cy.factory().build("user", narratorParams, loginCredentials);
});

Given("my user account has the role {string}", role => {
  cy.factory().build("user", {
    role,
    ...termsAndConditionsAgreedVersion,
  }, loginCredentials);
});

When("I log out", cy.logout);

When("I visit {string}", page => {
  cy.openPage(page);
});

When("I visit the {string} page", page => {
  cy.openPage(page);
});

When("a blocked user visits the post page of one of my authored posts", () => {
  cy.logout()
    .login({ email: annoyingParams.email, password: annoyingParams.password })
    .openPage('/post/previously-created-post')
})

Given("I am on the {string} page", page => {
  cy.openPage(page);
});

When("I fill in my email and password combination and click submit", () => {
  cy.login(loginCredentials);
});

When(/(?:when )?I refresh the page/, () => {
  cy.reload();
});

When("I log out through the menu in the top right corner", () => {
  cy.get(".avatar-menu").click();
  cy.get(".avatar-menu-popover")
    .find('a[href="/logout"]')
    .click();
});

Then("I can see my name {string} in the dropdown menu", () => {
  cy.get(".avatar-menu-popover").should("contain", narratorParams.name);
});

Then("I see the login screen again", () => {
  cy.location("pathname").should("contain", "/login");
});

Then("I can click on my profile picture in the top right corner", () => {
  cy.get(".avatar-menu").click();
  cy.get(".avatar-menu-popover");
});

Then("I am still logged in", () => {
  cy.get(".avatar-menu").click();
  cy.get(".avatar-menu-popover").contains(narratorParams.name);
});

When("I select {string} in the language menu", name => {
  cy.switchLanguage(name, true);
});

Given("I previously switched the language to {string}", name => {
  cy.switchLanguage(name, true);
});

Then("the whole user interface appears in {string}", name => {
  const {
    code
  } = helpers.getLangByName(name);
  cy.get(`html[lang=${code}]`);
  cy.getCookie("locale").should("have.property", "value", code);
});

Then("I see a button with the label {string}", label => {
  cy.contains("button", label);
});

When(`I click on {string}`, linkOrButton => {
  cy.contains(linkOrButton).click();
});

When(`I click on the menu item {string}`, linkOrButton => {
  cy.contains(".ds-menu-item", linkOrButton).click();
});

When("I press {string}", label => {
  cy.contains(label).click();
});

Given("we have the following posts in our database:", table => {
  cy.factory().build('category', {
    id: `cat-456`,
    name: "Just For Fun",
    slug: `just-for-fun`,
    icon: "smile"
  })

  table.hashes().forEach((attributesOrOptions, i) => {
    cy.factory().build("post", {
      ...attributesOrOptions,
      deleted: Boolean(attributesOrOptions.deleted),
      disabled: Boolean(attributesOrOptions.disabled),
      pinned: Boolean(attributesOrOptions.pinned),
    }, {
      ...attributesOrOptions,
      categoryIds: ['cat-456']
    });
  })
});

Then("I see a success message:", message => {
  cy.contains(message);
});

When("I click on the avatar menu in the top right corner", () => {
  cy.get(".avatar-menu").click();
});

When(
  "I click on the big plus icon in the bottom right corner to create post",
  () => {
    cy.get(".post-add-button").click();
  }
);

Given("I previously created a post", () => {
  lastPost.authorId = narratorParams.id
  lastPost.title = "previously created post";
  lastPost.content = "with some content";
  cy.factory()
    .build("post", lastPost);
});

When("I choose {string} as the title of the post", title => {
  lastPost.title = title.replace("\n", " ");
  cy.get('input[name="title"]').type(lastPost.title);
});

When("I type in the following text:", text => {
  lastPost.content = text.replace("\n", " ");
  cy.get(".editor .ProseMirror").type(lastPost.content);
});

Then("I select a category", () => {
  cy.get(".base-button")
    .contains("Just for Fun")
    .click();
});

When("I choose {string} as the language for the post", (languageCode) => {
  cy.get('.ds-flex-item > .ds-form-item .ds-select ')
    .click().get('.ds-select-option')
    .eq(languages.findIndex(l => l.code === languageCode)).click()
})

Then("the post shows up on the landing page at position {int}", index => {
  cy.openPage("landing");
  const selector = `.post-card:nth-child(${index}) > .ds-card-content`;
  cy.get(selector).should("contain", lastPost.title);
  cy.get(selector).should("contain", lastPost.content);
});

Then("I get redirected to {string}", route => {
  cy.location("pathname").should("contain", route.replace("...", ""));
});

Then("the post was saved successfully", () => {
  cy.get(".ds-card-content > .ds-heading").should("contain", lastPost.title);
  cy.get(".content").should("contain", lastPost.content);
});

Then(/^I should see only ([0-9]+) posts? on the landing page/, postCount => {
  cy.get(".post-card").should("have.length", postCount);
});

Then("the first post on the landing page has the title:", title => {
  cy.get(".post-card:first").should("contain", title);
});

Then(
  "the page {string} returns a 404 error with a message:",
  (route, message) => {
    cy.request({
        url: route,
        failOnStatusCode: false
      })
      .its("status")
      .should("eq", 404);
    cy.visit(route, {
      failOnStatusCode: false
    });
    cy.get(".error").should("contain", message);
  }
);

Given("my user account has the following login credentials:", table => {
  loginCredentials = table.hashes()[0];
  cy.debug();
  cy.factory().build("user", {
    ...termsAndConditionsAgreedVersion,
  }, loginCredentials);
});

When("I fill the password form with:", table => {
  table = table.rowsHash();
  cy.get("input[id=oldPassword]")
    .type(table["Your old password"])
    .get("input[id=password]")
    .type(table["Your new passsword"])
    .get("input[id=passwordConfirmation]")
    .type(table["Confirm new password"]);
});

When("submit the form", () => {
  cy.get("form").submit();
});

Then("I cannot login anymore with password {string}", password => {
  cy.reload();
  const {
    email
  } = loginCredentials;
  cy.visit(`/login`);
  cy.get("input[name=email]")
    .trigger("focus")
    .type(email);
  cy.get("input[name=password]")
    .trigger("focus")
    .type(password);
  cy.get("button[name=submit]")
    .as("submitButton")
    .click();
  cy.get(".iziToast-wrapper").should(
    "contain",
    "Incorrect email address or password."
  );
});

Then("I can login successfully with password {string}", password => {
  cy.reload();
  cy.login({
    ...loginCredentials,
    ...{
      password
    }
  });
  cy.get(".iziToast-wrapper").should("contain", "You are logged in!");
});

When("I log in with the following credentials:", table => {
  const {
    email,
    password
  } = table.hashes()[0];
  cy.login({
    email,
    password
  });
});

When("open the notification menu and click on the first item", () => {
  cy.get(".notifications-menu").invoke('show').click(); // "invoke('show')" because of the delay for show the menu
  cy.get(".notification-mention-post")
    .first()
    .click({
      force: true
    });
});

Then("see {int} unread notifications in the top menu", count => {
  cy.get(".notifications-menu").should("contain", count);
});

Then("I get to the post page of {string}", path => {
  path = path.replace("...", "");
  cy.url().should("contain", "/post/");
  cy.url().should("contain", path);
});

When(
  "I start to write a new post with the title {string} beginning with:",
  (title, intro) => {
    cy.get(".post-add-button").click();
    cy.get('input[name="title"]').type(title);
    cy.get(".ProseMirror").type(intro);
  }
);

When("mention {string} in the text", mention => {
  cy.get(".ProseMirror").type(" @");
  cy.get(".suggestion-list__item")
    .contains(mention)
    .click();
  cy.debug();
});

Then("the notification gets marked as read", () => {
  cy.get(".notifications-menu-popover .notification")
    .first()
    .should("have.class", "read");
});

Then("there are no notifications in the top menu", () => {
  cy.get(".notifications-menu").should("contain", "0");
});

Given("there is an annoying user called {string}", name => {
  cy.factory().build("user", {
    id: "annoying-user",
    name,
    ...termsAndConditionsAgreedVersion,
  }, annoyingParams);
});

Given("there is an annoying user who has muted me", () => {
  cy.neode()
    .first("User", {
      role: 'moderator'
    })
    .then(mutedUser => {
      cy.neode()
        .first("User", {
          id: 'annoying-user'
        })
        .relateTo(mutedUser, "muted");
    });
});

Given("I am on the profile page of the annoying user", name => {
  cy.openPage("/profile/annoying-user/spammy-spammer");
});

When("I visit the profile page of the annoying user", name => {
  cy.openPage("/profile/annoying-user");
});

When("I ", name => {
  cy.openPage("/profile/annoying-user");
});

When(
  "I click on {string} from the content menu in the user info box",
  button => {
    cy.get(".user-content-menu .base-button").click();
    cy.get(".popover .ds-menu-item-link")
      .contains(button)
      .click({
        force: true
      });
  }
);

When("I navigate to my {string} settings page", settingsPage => {
  cy.get(".avatar-menu-trigger").click();
  cy.get(".avatar-menu-popover")
    .find("a[href]")
    .contains("Settings")
    .click();
  cy.contains(".ds-menu-item-link", settingsPage).click();
});

Given("I follow the user {string}", name => {
  cy.neode()
    .first("User", {
      name
    })
    .then(followed => {
      cy.neode()
        .first("User", {
          name: narratorParams.name
        })
        .relateTo(followed, "following");
    });
});

Given('{string} wrote a post {string}', (_, title) => {
  cy.factory()
    .build("post", {
      title,
    }, {
      authorId: 'annoying-user',
    });
});

Then("the list of posts of this user is empty", () => {
  cy.get(".ds-card-content").not(".post-link");
  cy.get(".main-container").find(".ds-space.hc-empty");
});

Then("I get removed from his follower collection", () => {
  cy.get(".ds-card-content").not(".post-link");
  cy.get(".main-container").contains(
    ".ds-card-content",
    "is not followed by anyone"
  );
});

Given("I wrote a post {string}", title => {
  cy.factory()
    .build("post", {
      title,
    }, {
      authorId: narratorParams.id,
    });
});

When("I mute the user {string}", name => {
  cy.neode()
    .first("User", {
      name
    })
    .then(mutedUser => {
      cy.neode()
        .first("User", {
          name: narratorParams.name
        })
        .relateTo(mutedUser, "muted");
    });
});

When("I block the user {string}", name => {
  cy.neode()
    .first("User", {
      name
    })
    .then(blockedUser => {
      cy.neode()
        .first("User", {
          name: narratorParams.name
        })
        .relateTo(blockedUser, "blocked");
    });
});

When("I log in with:", table => {
  const [firstRow] = table.hashes();
  const {
    Email,
    Password
  } = firstRow;
  cy.login({
    email: Email,
    password: Password
  });
});

Then("I see only one post with the title {string}", title => {
  cy.get(".main-container")
    .find(".post-link")
    .should("have.length", 1);
  cy.get(".main-container").contains(".post-link", title);
});

Then("they should not see the comment from", () => {
  cy.get(".ds-card-footer").children().should('not.have.class', 'comment-form')
})

Then("they should see a text explaining commenting is not possible", () => {
  cy.get('.ds-placeholder').should('contain', "Commenting is not possible at this time on this post.")
})
