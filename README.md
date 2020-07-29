## So, you want to work on this repo?
## The first thing you gotta know is how amplify works.
Amplify is an AWS solution that can essentially be summed up as a "backend as a service". Our app is operating without a server, so amplify helps connect us to our Lambdas, Auth, and S3 buckets.

Amplify has a few main commands you should care about (please read the whole thing before trying these commands):

    amplify pull

This command pulls the current cloud environment so that your local amplify code matches the current cloud configuration.

    amplify push

This command pushes your local amplify code to the the current cloud configuration.

    amplify env list
    amplify env checkout <environment>

These commands show you the existing environments and allow you to switch your working environment, respectively.

    amplify

This just shows you what kind of backend components you can add, update, delete, etc. Please see amplify docs for specifics on each of them. (https://docs.amplify.aws/cli)

### Development Protocols
Okay so, this is a little confusing. How do I make sure that I don't ruin the backend environment? Well, you should *ALWAYS* check what backend environment you're in before you even consider running either a push or a pull. You can do this with:

    amplify env list

So, generally speaking, you would be doing the development work in dev. Check with the other devs to make sure you aren't pushing and pulling all at the same time because the backend might be giving you unexpected behavior because of someone else's changes.

Use Github as the *ultimate source of truth*. You can always use Github and version control to revert the cloud back to the way it was by ensuring your amplify folder has the same code as from before you started making changes and giving an:
    amplify push

### Moving to Staging/Master
When reviewing a PR, please pull the branch, and run both
    npm start
    amplify env checkout dev
    amplify push

The code in the branch should reflect the backend features you are adding to the product, since additions to the amplify code in the Github repo will act as *additions to the source of truth*.
