## Requst (curl)
```
curl 'https://www.bricklink.com/invSetEdit.asp' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/x-www-form-urlencoded' \
  -b "$COOKIE" \
  -H 'origin: https://www.bricklink.com' \
  -H 'pragma: no-cache' \
  -H 'priority: u=0, i' \
  -H 'referer: https://www.bricklink.com/invSet.asp?utm_content=subnav' \
  -H 'sec-ch-ua: "Google Chrome";v="149", "Chromium";v="149", "Not)A;Brand";v="24"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: document' \
  -H 'sec-fetch-mode: navigate' \
  -H 'sec-fetch-site: same-origin' \
  -H 'sec-fetch-user: ?1' \
  -H 'upgrade-insecure-requests: 1' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36' \
  --data-raw 'itemType=S&sellerOptionCost=&sellerOptionMyWeight=&sellerOptionStock=&itemNo=10281&itemSeq=1&incInstr=N&incParts=N&itemQty=1&breakType=M&breakSets=Y&itemCondition=U&itemPrice=I&itemRound=2&itemBulk=1&itemDesc=&itemRemarks=&TQ1=&TS1=&TQ2=&TS2=&TQ3=&TS3=&invDup=Y&invAdjustPrice=N&invAdjustBulk=O&invAdjustSale=O&invAdjustRemarks=N&invAdjustExtended=O&invAdjustStock=O&invAdjustRetain=O&invAdjustCost=O&invAdjustWeight=O&ItemInvSort=1&ItemInvAsc=A'
```

## Breakdown of data

### (First Section)

#### these need to explicitly be provided each time
| field/value     | description       |
|-----------------|-------------------|
| itemCondition=U | Default Condition |
| itemNo=10281    | Set Number        |
| itemQty=1       | Quantity of Sets  |

#### values we typically use (different from defaults)
- incInstr=N
- incParts=N

### Consolidate

#### values we typically use (different from defaults)
| field/value        | description                    |
|--------------------|--------------------------------|
| invAdjustPrice=N   | Old Price and Old Tier Pricing |
| invAdjustRemarks=N | New Remarks                    |

#### values we typically leave default (Old)
- invAdjustBulk=O
- invAdjustSale=O
- invAdjustExtended=O
- invAdjustStock=O
- invAdjustRetain=O
- invAdjustCost=O
- invAdjustWeight=O

### Sort Items

#### values we typically use (different from defaults)
| field/value   | description |
|---------------|-------------|
| ItemInvSort=1 | Item Name   |
| ItemInvAsc=A  | Up          |

### (Other Fields)

#### values we typically leave default
- itemType=S
- itemBulk=1
- sellerOptionCost=
- sellerOptionMyWeight=
- sellerOptionStock=
- itemSeq=1
- breakType=M
- breakSets=Y
- itemPrice=I
- itemRound=2
- itemDesc=
- itemRemarks=
- TQ1=
- TS1=
- TQ2=
- TS2=
- TQ3=
- TS3=
- invDup=Y

