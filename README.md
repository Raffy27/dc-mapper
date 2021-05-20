# dc-mapper
A small script for mapping partnerships between different Discord servers and data visualization. dc-mapper makes use of adaptive proxy rotation to bypass rate limiting on invite-related API endpoints, and uses Selenium to interact with the online version of Discord. A word of warning, use a throwaway account when testing this.

Since the online interface of Discord is prone to change, the current algorithms will most likely refuse to work with newer versions. This is just a quick 'n dirty, proof of concept script. Expect spectacular bugs.

For a summary of the algorithm, and possible use cases, see my blog post at [Ominous.tech](https://ominous.tech/kie-a-hatalom/).

## Features
* Login with session token or email/password
* Request available servers
* Look for invite links in messages
* Request invite information
* Join and leave new servers
* Save the resulting directed graph as JSON
* Export a version compatible with graph visualization libraries

## Screenshots
<details>
    <summary>Show screenshots</summary>
    <img alt="Resulting graph #1" src="https://i.lensdump.com/i/Z21cvv.png">
    <img alt="Resulting graph #2" src="https://i.lensdump.com/i/Z21U92.png">
    <img alt="Resulting graph #3" src="https://i2.lensdump.com/i/Z21xHz.png">
    <img alt="Prototype in action" src="https://i2.lensdump.com/i/Z2qWEr.gif">
</details>

## How to use

## License
This project is licensed under the MIT License -  see the <a href="https://github.com/Raffy27/dc-mapper/blob/main/LICENSE" target="_blank">LICENSE</a> file for details. For the dependencies, all rights belong to their respective owners. These should be used according to their respective licenses.
